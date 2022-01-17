<?php

/*
Script Name: 360 Virtual Tour PHP
Plugin URI: 
Description: The 360 Virtual Tour is a responsive script for displaying 360 degree virtual tours directly in the Browser on your website. 
Version: 1.1
Author: Aram Vardanyan
Author URI: http://web.edenstudio.am/
*/


$sourceUrl = '../sources/';


function image_uploader()
{
    $err = "";
    $total = count($_FILES['file']['name']);


    for ($i = 0; $i < $total; $i++) {
        if (exif_imagetype($_FILES["file"]['tmp_name'][$i]) != 2) {
        }
        if ($_FILES["file"]["error"][$i] > 0) {
            $err .= '<div class="w3-container w3-red"><p>Error! Please make sure that your images format is .jpg/.jpeg. And please fill all file type inputs.</p></div>';
            // echo $err;
        }
        if ($err === "") {
            $uploads_dir = './';
            $tmp_name = $_FILES["file"]["tmp_name"][$i];
            $name = md5($_FILES["file"]["name"][$i] . date("c")) . '.jpg';
            move_uploaded_file($tmp_name, "$uploads_dir/$name");

            $nameTxt = $_POST['name'][$i];

            $desc = $_POST['desc'][$i];

            $fp = fopen('data.txt', 'a');
            fwrite($fp, $nameTxt . " | " . $desc . " | " . $name . "\n");
            fclose($fp);
        }
    }
    echo $err;
}

if (!empty($_FILES["file"])) {
    image_uploader();
    header("Location: ./");
}
?>

<!DOCTYPE html>
<?php if (!file_exists('./data.txt')) :  ?>
    <html>

    <head>
        <title>Editor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="<?php echo $sourceUrl; ?>css/w3.css" media="all" rel="stylesheet" type="text/css" />
        <link href="<?php echo $sourceUrl; ?>css/editor.css" media="all" rel="stylesheet" type="text/css" />
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
        <script src="<?php echo $sourceUrl; ?>js/jquery-1.12.2.min.js"></script>
        <script src="<?php echo $sourceUrl; ?>js/editor.js"></script>
    </head>

    <body>

        <div class="w3-container w3-green">
            <h2>Örnek Mobilya Sanal Mağaza</h2>
        </div>

        <div class="container">
            <div class="w3-container">
                <div class="buttons">
                    <button class="add-form">Yeni Form Ekle</button>
                    <input class="submit" type="submit" name="submit" />
                </div>
            </div>
            <div class="form">
                <form action="" id="form" method="post" class="w3-container" enctype="multipart/form-data">
                    <div class="main-form">
                        <div class="w3-container w3-light-grey item first-form">
                            <div class="w3-container">
                                <p>1.</p>
                            </div>
                            <p class="file-upload">
                                <input class="w3-input" type="file" class="browse" name="file[]" onchange="" />
                            </p>
                            <p>
                                <input class="w3-input" type="text" name="name[]" placeholder="Name">
                            </p>
                            <textarea maxlength="150" class="w3-input" type="text" name="desc[]" placeholder="Description"></textarea>
                        </div>
                    </div>
                    <br>
                </form>
            </div>
            <div class="w3-container">
                <div class="buttons">
                    <button class="add-form">Yeni Form Ekle</button>
                    <input class="submit" type="submit" name="submit" />
                </div>
            </div>
        </div>
    </body>

    </html>
<?php endif;

// file exists print viewer
if (file_exists('./data.txt')) {
    $fileData = file_get_contents("./data.txt");
    $arrayOfNames = array_filter(explode("\n", $fileData));
?>
    <html>

    <head>
        <title>Örnek Mobilya Sanal Mağaza</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="360 Virtual Tour PHP" />
        <meta charset="UTF-8">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'>
        <link href="<?php echo $sourceUrl; ?>css/owl.carousel.css" media="all" rel="stylesheet" type="text/css" />
        <link href="<?php echo $sourceUrl; ?>css/style.css" media="all" rel="stylesheet" type="text/css" />
        <link href="<?php echo $sourceUrl; ?>css/animate.css" media="all" rel="stylesheet" type="text/css" />
        <link href="<?php echo $sourceUrl; ?>css/loaders.css" media="all" rel="stylesheet" type="text/css" />
        <link href="<?php echo $sourceUrl; ?>css/font-awesome.min.css" media="all" rel="stylesheet" type="text/css" />
        <script src="<?php echo $sourceUrl; ?>js/jquery-1.12.2.min.js"></script>
        <script>
            var autoScrol = true;
        </script>
    </head>

    <body>
        <div class="panorama-body">

            <div id="panorama">
                <div id="pan-canvas"></div>
                <div class="panos-menu">
                    <div id="panos-list">
                        <ul id="menu-show">
                            <div class="menu-centered">
                                <div class="owl-carousel">
                                    <?php
                                    $panCount = 0;

                                    for ($i = 0; $i < count($arrayOfNames); ++$i) {
                                        $panCount++;
                                        $filename = substr($arrayOfNames[$i], -36);

                                        $width = 300;
                                        $height = 300;

                                        list($width_orig, $height_orig) = getimagesize($filename);
                                        $ratio_orig = $width_orig / $height_orig;

                                        if ($width / $height > $ratio_orig) {
                                            $width = $height * $ratio_orig;
                                        } else {
                                            $height = $width / $ratio_orig;
                                        }


                                        $image_p = imagecreatetruecolor($width, $height);
                                        $image = imagecreatefromjpeg($filename);
                                        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);

                                        if (!file_exists('small')) {
                                            mkdir('small', 0777, true);
                                        }
                                        imagejpeg($image_p, "small/" . $filename, 90);

                                        $itName = array_filter(explode(" | ", $arrayOfNames[$i]));
                                        // if(!empty($itName[1]))
                                        //  echo "<p>Description:  ".$itName[1]."</p>"."\n";
                                    ?>

                                        <div data-hash="<?php echo $panCount;  ?>">
                                            <li data-pan-id="<?php echo $panCount;  ?>" data-pan-desc="<? echo $itName[1]; ?>" id="pan-menu-<?php echo $panCount;  ?>" class="pan-menu">

                                                <a class="pan-menu-item" id="pan-image-<?php echo $panCount; ?>" data-pan-href="<?php echo $filename ?>" href="#<?php echo $panCount; ?>">
                                                    <img class="pan-slide-thumb" src="small/<?php echo $filename ?>">
                                                    <?php
                                                    if (!empty($itName[0]))
                                                        echo $itName[0];
                                                    ?></a>
                                            </li>
                                        </div>
                                    <?php
                                    } // end loop
                                    ?>
                                </div>
                            </div>
                        </ul>


                        <i id="rotate" class="menu-button fa fa-chevron-down" aria-hidden="true"></i>
                        <span id="fullScreenMode">
                            <span id="fullscreenPan">Tam Ekran</span>
                        </span>
                        <a href="../../index" style="color: white; font-size:28px;">Ana Sayfaya Dön</a>
                        <div id="loader-pan" class="fadeInLeft animated">
                            <div class="wrapper">
                                <div class="cssload-loader"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php

                ?>
                <div id="loader-wrapper">
                    <div class="first-wrapper">
                        <div class="first-cssload-loader"></div>
                    </div>
                    <div class="loader-section section-left"></div>
                    <div class="loader-section section-right"></div>
                </div>
            </div>
            <div class="top_buttons"></div>

            <div class="keys">
                <div class="zoom_conrol">
                    <span id="zoom_in"><img class="zoom" src="<?php echo $sourceUrl; ?>img/zoom-in.png"></span>
                    <span id="zoom_out"><img class="zoom" src="<?php echo $sourceUrl; ?>img/zoom-out.png"></span>
                </div>

                <div class="control-key">
                    <img class="control_keys" id="left_key" src="<?php echo $sourceUrl; ?>img/left_button.PNG">
                    <img class="control_keys" id="right_key" src="<?php echo $sourceUrl; ?>img/right_button.PNG">
                    <img class="control_keys" id="up_key" src="<?php echo $sourceUrl; ?>img/up_button.PNG">
                    <img class="control_keys" id="down_key" src="<?php echo $sourceUrl; ?>img/down_button.PNG">
                    <img class="control_keys" id="elipse_key" src="<?php echo $sourceUrl; ?>img/elipse.PNG">
                </div>


            </div>


            <script src="<?php echo $sourceUrl; ?>js/three.min.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/jquery.fullscreen.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/DeviceOrientationControls.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/mousehold.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/owl.carousel.min.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/mousetrap.min.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/jquery.touch.js"></script>
            <script src="<?php echo $sourceUrl; ?>js/360.virtual.tour.js"></script>
        </div>
        <input id="source-url" type="hidden" value="<? echo $sourceUrl; ?>">

    </body>

    </html>


<?php
} // viewer end
?>