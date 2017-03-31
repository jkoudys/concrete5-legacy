<?php
session_write_close();

if (Loader::helper('validation/token')->validate()) {
	Collection::reindexPendingPages();
} else {
	print "Access Denied.";
}
