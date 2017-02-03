<?php
if (!ini_get('safe_mode')) {
    @set_time_limit(0);
}

if (Job::authenticateRequest($_REQUEST['auth'])) {
    $list = Job::getList();
    foreach ($list as $job) {
        if ($job->supportsQueue()) {
            $q = $job->getQueueObject();
            // don't process queues that are empty
            if ($q->count() <1) {
                continue;
            }
            $obj = new stdClass;
            try {
                $messages = $q->receive($job->getJobQueueBatchSize());
                foreach ($messages as $key => $p) {
                    $job->processQueueItem($p);
                    $q->deleteMessage($p);
                }
                $totalItems = $q->count();
                $obj->totalItems = $totalItems;
                $obj->jHandle = $job->getJobHandle();
                $obj->jID = $job->getJobID();
                if ($q->count() == 0) {
                    $result = $job->finish($q);
                    $obj = $job->markCompleted(0, $result);
                    $obj->totalItems = $totalItems;
                }
            } catch (Exception $e) {
                $obj = $job->markCompleted(Job::JOB_ERROR_EXCEPTION_GENERAL, $e->getMessage());
                $obj->message = $obj->result; // needed for progressive library.
            }
            echo json_encode($obj);
            // End when one queue has processed a batch step
            break;
        }
    }
}
