<?php
class Concrete5_Controller_Dashboard_Composer extends Controller
{
    public function view()
    {
        Loader::model("composer_page");
        $drafts = ComposerPage::getMyDrafts();
        if (count($drafts) > 0) {
            return $this->redirect('/dashboard/composer/drafts');
        }

        return $this->redirect('/dashboard/composer/write');
    }
}
