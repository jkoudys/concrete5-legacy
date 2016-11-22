[![Build Status](https://travis-ci.org/concrete5/concrete5-legacy.png?branch=master)](https://travis-ci.org/concrete5/concrete5-legacy)


        c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c
       c5c5c5c5c5c5c5c5c-c5c5c5c5c5c5c5c
     | c5c5c5c5c5--c5c5   5c5c5c5c5c5c5c
     | c5c5c5c5c   c5c5   c5c5c.5c5c5c5c
     | c5c5c5c5c.  c5c5   c5c5  :c5c5c5c
     | c5c- .c5c5   5c5   c5c.  5c5c5c5c
     | c5c5  :c5c   c5c.  c5c  '5c5c5c5c                              .,
     | c5c5:  c5c:  c5c5 .c5.  c5c5c5c5c                              /c-._
     | c5c5c. :5c5c-c5c5-5c5:.5c5c5c5c5c                           --/c5c5c\
     | c5c5c5c.5c5:.       .:c5c5c5c5c5c                       .--/c5c5c5c5c5c\
     | c5c5c5c5.             .c5c5-.5c5c                   __-"5c5c5c5c5c5c5c5c'-._
     | c5c5c5c     .c5c5c5c5c5c5.   .c5c                _-/c5c5c5-5.-"'-c5c5c5c5c5c\_           _____
     | c5c5c5      5c5c5c5c5c5.    c5c5c         _.,-='"c-*-:;   *,      '"*5c5c5c5c5"--__     / ____]
     | c5c5c5:     :c5c5c5c5.    :5c5c5c     -"""c5; c5c    `      '           '"'_'"""'- "'- / /___
     | c5c5c5c:      .c5c.     :5c5c5c5c     ___   ___   _ _    ___  _ _   ___  _| |_   _ _  / ___  \
     | c5c5c5c5c5:.         .c5c5c5c5c5c    /  _] /   \ |   \  /  _]|  _] /   \|_   _| /   \ __    \ \
     | c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c   (  (_ (     )| || |(  (_ | /  (  ---  | |_ (  --- \ \ _ / /
     \  c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c    \\___]\\___/||_||_|\\___]|_|  \\___/ \\___]\\___/ \\_____/
       ------------------------------        --    --   -- --   --  --     --     --    --     ----

# Legacy Version

This is the legacy version of Concrete5. It is still being actively maintained, but significant development and new features are a part of Version 5.7 and greater.
New versions of concrete5 can be found in this repository: http://github.com/concrete5/concrete5/

# Note

This is the development distribution of concrete5 Legacy. It is bleeding edge. The latest development build can be downloaded from https://github.com/concrete5/concrete5-legacy/zipball/master.

For the latest fully supported release, check out http://www.concrete5.org/download/

# Installation Instructions for concrete5

1. Make sure your config/, packages/ and files/ directories are writable by a web server. These directories are in the root of the archive. This can either be done by making the owner of the directories the web server user, or by making them world writable using chmod 777 (in Linux/OS X.)
2. Create a new MySQL database and a MySQL user account with the following privileges on that database: INSERT, SELECT, UPDATE, DELETE, CREATE, DROP, ALTER
3. Visit your concrete5 site in your web browser. You should see an installation screen where you can specify your site's name, your base URL, and your database settings, and the rest of the information necessary to install concrete5.
4. Click through and wait for the installation to complete.
5. concrete5 should be installed.

# Documentation

http://concrete5.org/documentation/

# Code Submissions

http://www.concrete5.org/developers/submitting-code/submitting_code_to_concrete/

### Short Tags
The shed has been painted green. PHP short tags are removed completely.

### Building Assets
You *do not* need to build assets in order to run the github master
This is only needed if you are hacking core javascript and css.
For further details see the `build` folder.
