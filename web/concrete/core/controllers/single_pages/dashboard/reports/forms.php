<?php defined('C5_EXECUTE') or die("Access Denied.");
Loader::block('form');

class Concrete5_Controller_Dashboard_Reports_Forms extends DashboardBaseController
{

    protected $pageSize = 10;

    public function view()
    {
        if ($_REQUEST['all']) {
            $this->pageSize = 100000;
            $_REQUEST['page'] = 1;
        }
        $this->loadSurveyResponses();
    }

    public function excel()
    {
        $dateHelper = Loader::helper('date');

        $this->pageSize = 0;
        $this->loadSurveyResponses();
        $textHelper = Loader::helper('text');

        $questionSet = $this->get('questionSet');
        $answerSets = $this->get('answerSets');
        $questions = $this->get('questions');
        $surveys = $this->get('surveys');

        $fileName = $textHelper->filterNonAlphaNum($surveys[$questionSet]['surveyName']);

        header("Content-Type: application/vnd.ms-excel");
        header("Cache-control: private");
        header("Pragma: public");
        $date = date('Ymd');
        header("Content-Disposition: inline; filename=" . $fileName . "_form_data_{$date}.xls");
        echo "<html>\r\n<head>\r\n";
        echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=" . APP_CHARSET . "\">\r\n";
        echo "<title>" . $textHelper->entities(t(/*i18n: %1$s is the survey name, %2$s is the date. */ '%1$s Form Data Output - Run on %2$s', $surveys[$questionSet]['surveyName'], $date)) . "</title>\r\n";
        echo "</head>\r\n<body>\r\n";
        echo "<table>\r\n";
        $hasCBRow = false;
        foreach ($questions as $questionId => $question) {
            if ($question['inputType'] == 'checkboxlist') {
                $hasCBRow = true;
            }
        }
        echo "<thead>\r\n\t<tr>\r\n";
        echo "\t\t<th ";
        if ($hasCBRow) {
            echo "rowspan=\"2\" valign='bottom'";
        }
        echo ">" . t('Submitted Date') . "</th>\r\n";
        echo "<th ";
        if ($hasCBRow) {
            echo "rowspan=\"2\" valign='bottom'";
        }
        echo "><b>" . t('User') . "</b></th>\r\n";

        foreach ($questions as $questionId => $question) {
            if ($question['inputType'] == 'checkboxlist') {
                $options = explode('%%', $question['options']);
                echo "\t\t".'<th colspan="' . count($options) . '"><b>'."\r\n";
            } else {
                echo "\t\t<th ";
                if ($hasCBRow) {
                    echo "rowspan=\"2\" valign='bottom'";
                }
                echo "><b>\r\n";
            }
            echo "\t\t\t" . $questions[$questionId]['question'] . "\r\n";
            echo "\t\t</b></th>\r\n";
        }
        echo "</tr>";

        // checkbox row
        if ($hasCBRow) {
            echo "<tr>";
            foreach ($questions as $questionId => $question) {
                if ($question['inputType'] == 'checkboxlist') {
                    $options = explode('%%', $question['options']);
                    foreach ($options as $opt) {
                        echo "<th><b>{$opt}</b></th>";
                    }
                }
            }
            echo "</tr>";
        }

        echo "</thead>\r\n<tbody>\r\n";
        foreach ($answerSets as $answerSet) {
            $questionNumber = 0;
            echo "\t<tr>\r\n";
            echo "\t\t<td>". $dateHelper->getSystemDateTime($answerSet['created']) . "</td>\r\n";
            echo "\t\t<td>";
            if ($answerSet['uID'] > 0) {
                $ui = UserInfo::getByID($answerSet['uID']);
                if (is_object($ui)) {
                    echo $ui->getUserName();
                }
            }
            echo "</td>\r\n";
            foreach ($questions as $questionId => $question) {
                $questionNumber++;
                switch ($question['inputType']) {
                    case 'checkboxlist':
                        $options = explode('%%', $question['options']);
                        $subanswers = explode(',', $answerSet['answers'][$questionId]['answer']);
                        for ($i = 1; $i <= count($options); $i++) {
                            echo "\t\t<td align='center'>\r\n";
                            if (in_array(trim($options[$i - 1]), $subanswers)) {
                                // echo "\t\t\t".$options[$i-1]."\r\n";
                                echo "x";
                            } else {
                                echo "\t\t\t&nbsp;\r\n";
                            }
                            echo "\t\t</td>\r\n";
                        }
                        break;
                    case 'fileupload':
                        echo "\t\t<td>\r\n";
                        $fID = intval($answerSet['answers'][$questionId]['answer']);
                        $file = File::getByID($fID);
                        if ($fID && $file) {
                            $fileVersion = $file->getApprovedVersion();
                            echo "\t\t\t".'<a href="'. $fileVersion->getDownloadURL() . '">' . $fileVersion->getFileName() . '</a>'."\r\n";
                        } else {
                            echo "\t\t\t" . t('File not found') . "\r\n";
                        }
                        echo "\t\t</td>\r\n";
                        break;
                    default:
                        echo "\t\t<td>\r\n";
                        echo "\t\t\t" . $answerSet['answers'][$questionId]['answer'].$answerSet['answers'][$questionId]['answerLong'] . "\r\n";
                        echo "\t\t</td>\r\n";
                        break;
                }
            }
            echo "\t</tr>\r\n";
        }
        echo "</tbody>\r\n</table>\r\n";
        echo "</body>\r\n";
        echo "</html>\r\n";
        die;
    }

    private function loadSurveyResponses()
    {
        $c=$this->getCollectionObject();
        $tempMiniSurvey = new MiniSurvey();
        $pageBase = DIR_REL . '/' . DISPATCHER_FILENAME . '?cID=' . $c->getCollectionID();

        if ($_REQUEST['action'] == 'deleteForm') {
            if (!Loader::helper('validation/token')->validate('deleteForm')) {
                $this->error->add(t('Invalid Token.'));
            } else {
                $this->deleteForm($_REQUEST['bID'], $_REQUEST['qsID']);
            }
        }

        if ($_REQUEST['action'] == 'deleteFormAnswers') {
            if (!Loader::helper('validation/token')->validate('deleteFormAnswers')) {
                $this->error->add(t('Invalid Token.'));
            } else {
                $this->deleteFormAnswers($_REQUEST['qsID']);
                $this->redirect('/dashboard/reports/forms');
            }
        }

        if ($_REQUEST['action'] == 'deleteResponse') {
            if (!Loader::helper('validation/token')->validate('deleteResponse')) {
                $this->error->add(t('Invalid Token.'));
            } else {
                $this->deleteAnswers($_REQUEST['asid']);
            }
        }

        //load surveys
        $surveysRS = FormBlockStatistics::loadSurveys($tempMiniSurvey);

        //index surveys by question set id
        $surveys = array();
        while ($survey = $surveysRS->fetchRow()) {
            //get Survey Answers
            $survey['answerSetCount'] = MiniSurvey::getAnswerCount($survey['questionSetId']);
            $surveys[ $survey['questionSetId'] ] = $survey;
        }

        //load requested survey response
        if (!empty($_REQUEST['qsid'])) {
            $questionSet = intval(preg_replace('/[^[:alnum:]]/', '', $_REQUEST['qsid']));

            //get Survey Questions
            $questionsRS = MiniSurvey::loadQuestions($questionSet);
            $questions = array();
            while ($question = $questionsRS->fetchRow()) {
                $questions[$question['msqID']] = $question;
            }

            //get Survey Answers
            $answerSetCount = MiniSurvey::getAnswerCount($questionSet);

            //pagination
            $pageBaseSurvey = $pageBase.'&qsid='.$questionSet;
            $paginator = Loader::helper('pagination');
            $sortBy = $_REQUEST['sortBy'];
            $paginator->init(
                (int) $_REQUEST['page'],
                $answerSetCount,
                $pageBaseSurvey . '&page=%pageNum%&sortBy=' . $sortBy,
                $this->pageSize
            );

            if ($this->pageSize > 0) {
                $limit = $paginator->getLIMIT();
            } else {
                $limit = '';
            }
            $answerSets = FormBlockStatistics::buildAnswerSetsArray($questionSet, $sortBy, $limit);
        }
        $this->set('questions', $questions);
        $this->set('answerSets', $answerSets);
        $this->set('paginator', $paginator);
        $this->set('questionSet', $questionSet);
        $this->set('surveys', $surveys);
    }
    // SET UP DELETE FUNCTIONS HERE
    // DELETE SUBMISSIONS
    private function deleteAnswers($asID)
    {
        $db = Loader::db();
        $v = array(intval($asID));
        $q = 'DELETE FROM btFormAnswers WHERE asID = ?';
        $db->query($q, $v);

        $q = 'DELETE FROM btFormAnswerSet WHERE asID = ?';
        $db->query($q, $v);
    }
    //DELETE A FORM ANSWERS
    private function deleteFormAnswers($qsID)
    {
        $db = Loader::db();
        $v = array(intval($qsID));
        $q = 'SELECT asID FROM btFormAnswerSet WHERE questionSetId = ?';

        $r = $db->query($q, $v);
        while ($row = $r->fetchRow()) {
            $asID = $row['asID'];
            $this->deleteAnswers($asID);
        }
    }
    //DELETE FORMS AND ALL SUBMISSIONS
    private function deleteForm($bID, $qsID)
    {
        $db = Loader::db();
        $this->deleteFormAnswers($qsID);

        $v = array(intval($bID));
        $q = 'DELETE FROM btFormQuestions WHERE bID = ?';
        $db->query($q, $v);

        $q = 'DELETE FROM btForm WHERE bID = ?';
        $db->query($q, $v);

        $q = 'DELETE FROM Blocks WHERE bID = ?';
        $db->query($q, $v);
    }
}
