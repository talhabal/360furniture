"use strict";
$(document).ready(function(){
    
    var sourceUrl = $('#source-url').val();   // change icons source URLs there
    
    
var camera,
        scene,
        element = document.getElementById('pan-canvas'), // Inject scene into this
        renderer,
        fullscreenMode= false,
        onPointerDownPointerX,
        onPointerDownPointerY,
        onPointerDownLon,
        onPointerDownLat,
        fov = 70, // Field of View
        isUserInteracting = false,
        lon = 0,
        lat = 0,
        phi = 0,
        theta = 0,
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        onMouseDownLon = 0,
        onMouseDownLat = 0,
        width = $(document).width(), // int || window.innerWidth
        height = $(document).height(), // int || window.innerHeight
        windowHeight,
        ratio = width / height,
        touchX, 
        touchY,
        geometry = [],
        material = [],
        mesh = [];
        var clickedMenu = true;
        var touchMove = true;
        var touchMoveStarter =0;
        var textureNum = 0;
        var oldPan =0;
    if(isNaN(locationHash())==false && locationHash()!==0){
        var panoramaImage= $('#pan-image-'+ locationHash()).attr('data-pan-href');
        $('.pan-description').html($('#pan-menu-'+ locationHash()).attr('data-pan-desc'));
    }
    else {
        var panoramaImage= $('#pan-image-1').attr('data-pan-href');
        $('.pan-description').html($('#pan-menu-1').attr('data-pan-desc'));

    }


    mesh = [];
    var texture = [];
    texture[textureNum] = THREE.ImageUtils.loadTexture(panoramaImage, new THREE.UVMapping(), function() {
    init();
    animate();
});
function init() {
    
    camera = new THREE.PerspectiveCamera(fov, ratio, 1, 3000);
    scene = new THREE.Scene();
    geometry[textureNum] = new THREE.SphereGeometry(1600, 60, 40);
    material[textureNum] = new THREE.MeshBasicMaterial({map: texture[[textureNum]]});
    mesh[textureNum] = new THREE.Mesh(geometry[textureNum], material[textureNum]);
    mesh[textureNum].scale.x = -1;
    scene.add(mesh[textureNum]);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateProjection();
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    element.addEventListener('mousedown', onDocumentMouseDown, false);
    element.addEventListener('mousewheel', onDocumentMouseWheel, false); 
    element.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
    
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    
    window.addEventListener( 'resize', onWindowResize, false );
    

}
    
    function cleanMemory(){
        if(textureNum!==oldPan){
            scene.remove(mesh[oldPan]);
            geometry[oldPan].dispose();
            geometry[oldPan] = null;
            material[oldPan].dispose();
            material[oldPan] = null;
            texture[oldPan].dispose();
            texture[oldPan] = null;
            mesh[oldPan] = null;
        }
    }

function updateProjection(){
        camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 3000);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onWindowResized(event) {
    renderer.setSize(width, height);
    camera.projectionMatrix.makePerspective(fov, ratio, 1, 3000);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    element.addEventListener('mousemove', onDocumentMouseMove, false);
    element.addEventListener('mouseup', onDocumentMouseUp, false);
    /* TOUCHSCREENS */
    element.addEventListener('touchstart', onDocumentTouchStart, false);
    element.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

            function onDocumentTouchMove( event ) {
                
                if(touchMove){
                event.preventDefault();
                var touch = event.touches[ 0 ];
                lon -= ( touch.screenX - touchX ) * 0.2;
                lat -= ( touch.screenY - touchY ) * 0.2;
                touchX = touch.screenX;
                touchY = touch.screenY;
            }
 }
            function onDocumentTouchStart( event ) {

                event.preventDefault();
                var touch = event.touches[ 0 ];
                touchX = touch.screenX;
                touchY = touch.screenY;

            }

function onDocumentMouseMove(event) {
    lon = (event.clientX - onPointerDownPointerX) * -0.175 + onPointerDownLon;
    lat = (event.clientY - onPointerDownPointerY) * -0.175 + onPointerDownLat;
}
function onDocumentMouseUp(event) {
    element.removeEventListener('mousemove', onDocumentMouseMove, false);
    element.removeEventListener('mouseup', onDocumentMouseUp, false);
}
function onDocumentMouseWheel(event) {
    // WebKit
    if (event.wheelDeltaY) {
        fov -= event.wheelDeltaY * 0.05;
        // Opera / Explorer 9
    } else if (event.wheelDelta) {
        fov -= event.wheelDelta * 0.05;
        // Firefox
    } else if (event.detail) {
        fov += event.detail * 1.0;
    }
    if (fov < 45 || fov > 90) {
        fov = (fov < 45) ? 45 : 90;
    }
        camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 3000);

}
function animate() {
    requestAnimationFrame(animate);
    render();
}

Mousetrap.bind('right', function() {onKeyRight(); });
Mousetrap.bind('left', function() {onKeyLeft(); });
Mousetrap.bind('down', function() {onKeyDown(); });
Mousetrap.bind('up', function() {onKeyUp(); });

function onKeyRight(){
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lon+=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
}

function onKeyLeft(){
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lon-=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }

}


function onKeyDown(){
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lat+=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
}


function onKeyUp(){
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lat-=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
}

function render() {

    if (isUserInteracting === false) {
        lon += .05;
    }
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);
    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 100 * Math.cos(phi);
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

    /* Functions */

    panoramaCaruserl();
    buttonControl();
    fullscreenPanorama();
    buttonZoom();
    playMusic();
    fullPagePanorama();
    owlCarousel();
    changePanImage();
    loadingOverlay();
    hideMenu();
    hideFullscreenOnIos();
    panSlideSwipeFunction();
    getPanDescription();
   
    
    function locationHash(){
        return parseInt(window.location.hash.replace('#',''));
    }
    function panoramaCaruserl(){
        if(autoScrol===false) {
           isUserInteracting = true; 
        }
        $('#elipse_key').click(function(){
            if(isUserInteracting === false){
                isUserInteracting = true;
            }
            else{
                isUserInteracting = false; 
            }
            render();
        });
    }

    function buttonControl() {

        $('#right_key').on('mousedown touchstart', onKeyRight);
        $('#left_key').on('mousedown touchstart', onKeyLeft);
        $('#down_key').on('mousedown touchstart', onKeyDown);
        $('#up_key').on('mousedown touchstart', onKeyUp);
        
        $('#right_key').mousehold(function() {
           onRightHold();
        });
        $('#left_key').mousehold(function() {
             onLeftHold(); 
        });
        
        $('#down_key').mousehold(function() {
            onDownHold();  
        });
        
        $('#up_key').mousehold(function() {
             onUpHold(); 
        });
    }
    
function onRightHold() {
    
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lon+=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
    
}

function onLeftHold() {
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lon-=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
}

function onUpHold() {
        var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lat-=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
}

function onDownHold() {
    var counter = 0;
    var tt=setInterval(function(){startTime()},10);
    function startTime() {
        lat+=0.25;
        if(counter == 40) {
            clearInterval(tt);
        } else {
            counter++;
        }
    }
}

    function buttonZoom(){
        $('#zoom_in').on('mousedown touchstart', zoomIn);
         $('#zoom_out').on('mousedown touchstart', zoomOut);
    }
    


   function zoomIn() {
        var counter = 0;
        var tt=setInterval(function(){startTime()},10);
        function startTime() {
            if (fov < 45 || fov > 90) {
            fov = (fov < 45) ? 45 : 90;
            }

            fov-=0.25;
              updateProjection();
            if(counter == 40) {
                clearInterval(tt);
            } else {
                counter++;
            }
    }
 
    }

   function zoomOut() {
        var counter = 0;
        var tt=setInterval(function(){startTime()},10);
        function startTime() {
            if (fov < 45 || fov > 90) {
            fov = (fov < 45) ? 45 : 90;
             }
            fov+=0.25;
            updateProjection();
            if(counter == 40) {
                clearInterval(tt);
            } else {
                counter++;
            }
        }

    }

    function fullscreenPanorama(){
         $('#fullscreenPan').bind('touchstart click', function() {
             $('#fullscreen-icon').attr("src", sourceUrl + "img/fullscreen.png");
            if($(document).fullScreen() == false){
                $('#panorama').fullScreen(true);
                fullscreenMode = true;
                $('#fullScreenMode').addClass('now-full-screen');
                $('#fullscreen-icon').attr("src", sourceUrl + "img/leaveFullScreen.png");
            }
            else {
                $('#panorama').fullScreen(false);
                fullscreenMode = false;
                $('#fullScreenMode').removeClass('now-full-screen');
            }
        });
        
        }

 setInterval(function(){
    if($(document).fullScreen()==false) {
        $('#panorama').fullScreen(false);
            fullscreenMode = false;
            $('#fullscreen-icon').attr("src", sourceUrl + "/img/fullscreen.png");
            $('#fullScreenMode').removeClass('now-full-screen');
        }
        }, 3000);
    
     setInterval(function(){
        
        if  ($("#pan-canvas").find('canvas').length > 1){
             $('#pan-canvas').children('canvas:first').remove();
             $('#loader-pan').hide();
            clickedMenu = true;
            cleanMemory();
        }
        else {
           // 
        }
    }, 500);

    function leaveFullScreen(){
            $('#panorama').fullScreen(false);
            fullscreenMode = false;
    }
  
    function playMusic(){
        $('#pButton').click(function() {
             if (music.paused) {
            music.play();
            // remove play, add pause
            pButton.className = "";
            pButton.className = "fa fa-volume-up";
        } else { // pause music
            music.pause();
            // remove pause, add play
            pButton.className = "";
            pButton.className = "fa fa-volume-off";
        }
        });
    }


    function fullPagePanorama(){
        $('#pan-canvas').css('height', windowHeight + 'px');

    }
    function resizeFullPage(){
         $('#pan-canvas').css('height', $(document).height() + 'px');
    }
        
    function panSlideSwipeFunction() {
        $('#panos-list').on('swipe', function(){
             $(".owl-carousel").data('owlCarousel').init({
                touchDrag  : true
             });
            touchMove = false;
        });

         $('#pan-canvas').on('touchmove', function(){
                 $(".owl-carousel").data('owlCarousel').reinit({
                    touchDrag  : false
                 });

                 touchMove = true;
         });
    }
    
    function owlCarousel(event){
        var owl = $(".owl-carousel");
        owl.owlCarousel({
        margin:0,
        responsive:true,
        itemsCustom : [
        [0, 2],
        [450, 2],
        [600, 4],
        [700, 6],
        [1000, 8],
        [1200, 8],
        [1400, 10],
        [1600, 10]
      ],
        autoWidth:true,
        loop:true,
        URLhashListener:true,
        startPosition: 'URLHash',
        items:8
    });
}
    
    function getPanDescription(){
        
    }
        
    function changePanImage() {
        $('.pan-menu').on('click doubleTap', function (e) {
            if (clickedMenu){
            clickedMenu = false;
            window.location.hash = textureNum;
            oldPan = textureNum;
            textureNum = $(this).attr('data-pan-id');
            $('.pan-description').html($(this).attr('data-pan-desc'));
            $('.pan-menu').removeClass('hover-effect');
            $(this).addClass('hover-effect');
            $('#loader-pan').show();
            panoramaImage = $(this).find('a').attr('data-pan-href');
            texture[textureNum] = THREE.ImageUtils.loadTexture(panoramaImage, new THREE.UVMapping(), function() {
            init();
            });
            }
        });
    }
    
    function loadingOverlay() {
        setInterval(function(){
        if  ($("#pan-canvas").find('canvas').length == 1){
            $('body').addClass('loaded');
            $('#panos-list').addClass('animated fadeInDown');
        }
        }, 1000);
       $('body').removeClass('loaded');
    }
    function hideMenu(){
        function hide() {
            if ($("#panos-list").css('bottom')== '0px'){
                $("#panos-list").animate({ bottom : '-'+($('#panos-list').height())+'px' },300);
                $('.menu-button').removeClass('fa-chevron-down');
                $('.menu-button').addClass('fa-chevron-up');
            }
            else {
                show();
            }
        }
        function show(){
                $("#panos-list").animate({ bottom : '0px' },300);
                $('.menu-button').removeClass('fa-chevron-up');
                $('.menu-button').addClass('fa-chevron-down');
        }
        
            $('#panos-list').on('swipe', function(e, Dx, Dy){
			if(Dy < 0){
                hide();
            }
            if(Dy > 0){
                show();
            }
            });
        var degree = '180deg'
        $('.menu-button').on('click touchstart', function () {
            hide();
        });
    }
    function hideFullscreenOnIos(){
        if(getMobileOperatingSystem()== 'iOS') {
            $('#fullScreenMode').hide();
        }
    }

    
    function getMobileOperatingSystem() {
        
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
        {
        return 'iOS';

        }
        else if( userAgent.match( /Android/i ) )
        {

        return 'Android';
        }
        else
        {
        return 'unknown';
        }
}

    

});
