<?php
Loader::block('form');

class Concrete5_Controller_Dashboard_Reports extends Controller {
    public function __construct() {
        $this->redirect("/dashboard/reports/statistics");
    }
}
