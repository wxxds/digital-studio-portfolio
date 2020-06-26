//NAVIGATION
var leftOpen = false;
var overlayOpen = false;
var cartOpen = false;
var sectionCenter = "typefaces";
var internalHash = false;
var centerLoaded = true;
var centerChange = false;
var accountOpen = "signin";
var checkoutOpen = "cart";
var sideNavOpen = true;

//PAGE DATA
var typefaceData = "";
var gearData = "";
var customData = "";
var typefaceList;
var typefaceBasicData = "";
var gearList;
var gearBasicData = "";
var customList;
var customBasicData = "";
var typefaceLoaded = false;
var gearLoaded = false;
var customLoaded = false;

//SCALING
var isMobile = false;
var mobileSmall = false;
var touch = false;
var padding;
var bodySize;
var titleSize;
var titleSizeSmall;
var inputHeight;


//MISC
var arrowPos = 0;
var arrowPrev = 0;
var arrowDest = 0;
var backArrowDest = 0;
var backArrowPrev = 0;
var mouse = {x: 0, y: 0};


//TYPEFACE PAGE
var openFont = "";
var italicSelected = false;
var monoSelected = false;
var italicSelectedW = false;
var monoSelectedW = false;
var currWeight = "regular";
var currWidth = 0;
var currWidth2 = 0;
var weightVals;
var monoWeightVals;
var isMono = false;
var isItalic = false;
var gridChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?+-=*&%£$€@";
var caps = false;
var wordSets = [];
var weightWordsIndex = 0;
var weights = ["light", "regular", "medium", "semibold", "bold", "extrabold", "black", "family"];
var isVariable = false;
var variableAxis;
var variableCurr = [];
var variableSelected = false;
var $mq;
var click = false; //xray
var lerpWait = false;



$(document).ready(function(){

  scaling();
  loadData();

});

function scaling(){

  //SET PAGE AND FONT SIZES

  if ("ontouchstart" in document.documentElement){
    touch = true;
  } else {
    touch = false;
  }

  if(window.innerWidth <= 1440){
    padding = "25px";
    bodySize = "16px";
    inputHeight = "37";
    titleSize = "8vh";
    titleSizeSmall = "5vw";
  } else {
    padding = "40px";
    bodySize = "20px";
    inputHeight = "49";
    titleSize = "10vh";
    titleSizeSmall = "5vw";
  }

  if(window.innerWidth <= 1100){
    titleSize = 100 * (65 / window.innerWidth) + "vh";
  }

  if(window.innerWidth <= 900){
    isMobile = true;
    titleSize = 100 * (50 / window.innerWidth) + "vh";
    titleSizeSmall = "65px";
  } else {
    isMobile = false;
  }

   if(window.innerWidth <= 600){
    mobileSmall = true;
    titleSizeSmall = "50px";
  } else {
    mobileSmall = false;
  }

  if(window.innerWidth <= 350){
    titleSizeSmall = "40px";
  }

  resizeBlocks();

}

function loadData(){

  //LOAD TYPEFACE DATA
  $.getJSON("./data/typefaceDataNew.json", function(json) {

    typefaceData = json;

    //LIST OF RELEASED TYPEFACES
    typefaceList = Object.keys(typefaceData);
    for(var i = typefaceList.length - 1; i >= 0; i--){
      if(typefaceData[typefaceList[i]].displayName == undefined){
        typefaceList.splice(i, 1);
      }
    }

    //STORE BASIC TYPEFACE DATA FOR CENTER PAGE BLOCKS
    typefaceBasicData += '{';
    for(var i = typefaceList.length - 1; i >= 0; i--){
      if(i != typefaceList.length - 1){
        typefaceBasicData += ',';
      }
      typefaceBasicData += '"' + typefaceList[i] + '": {';
      typefaceBasicData += '"displayName": "' + typefaceData[typefaceList[i]].displayName + '",';
      typefaceBasicData += '"details": [';
      for(var k = 0; k < typefaceData[typefaceList[i]].details.length; k++){
        if(k != 0){
          typefaceBasicData += ',';
        }
        typefaceBasicData += '"' + typefaceData[typefaceList[i]].details[k] + '"';
      }
      typefaceBasicData += ']';

      typefaceBasicData += '}';
    }
    typefaceBasicData += '}';

    typefaceLoaded = true;
    if(gearLoaded && customLoaded){
      loadCenter();
    }
  });

  //LOAD CUSTOM DATA
  $.getJSON("data/customDataNew.json", function(json) {
    customData = json;
    customList = Object.keys(customData);

    customBasicData += '{';
    for(var i = customList.length - 1; i >= 0; i--){
      if(i != customList.length - 1){
        customBasicData += ',';
      }
      customBasicData += '"' + customList[i] + '": {';
      customBasicData += '"displayName": "' + customData[customList[i]].displayName + '",';
      customBasicData += '"year": "' + customData[customList[i]].year + '"';

      customBasicData += '}';
    }
    customBasicData += '}';

    customLoaded = true;
    if(gearLoaded && typefaceLoaded){
      loadCenter();
    }
  });

  //LOAD GEAR DATA
  $.getJSON("data/gearDataNew.json", function(json) {
    gearData = json;
    gearList = Object.keys(gearData);

    //STORE BASIC TYPEFACE DATA FOR CENTER PAGE BLOCKS
    gearBasicData += '{';
    for(var i = gearList.length - 1; i >= 0; i--){
      if(i != gearList.length - 1){
        gearBasicData += ',';
      }
      gearBasicData += '"' + gearList[i] + '": {';
      gearBasicData += '"displayName": "' + gearData[gearList[i]].displayName + '",';
      gearBasicData += '"price": "' + gearData[gearList[i]].price + '"';

      gearBasicData += '}';
    }
    gearBasicData += '}';

    gearLoaded = true;
    if(typefaceLoaded && customLoaded){
      loadCenter();
    }
  });

}

function loadCenter(){

  //GENERATE CENTER SCROLL SECTION

  $.get('php/centerScroll.php', function(response) {
    $(".section--center").html(response);
    if(!isMobile){
      dualScroll();
    }
    loadInteract();
    initRouter();
    initListeners();
  });

}

function loadInteract(){
  $.getScript("scripts/interaction/omseBall.js", function(){
  });
  $.getScript("scripts/interaction/charChange.js", function(){
  });
  $.getScript("scripts/interaction/scrollGrav.js", function(){
  });
  $.getScript("scripts/interaction/omsetype.js", function(){
  });
}


//LOAD REQUESTED PAGE
function initRouter(){
  hashHandler();
  window.addEventListener('hashchange', hashHandler, false);

  if(signedIn){
    accountOpen = 'orders';
  }
}


//PAGE ROUTER
function hashHandler() {
  if(!internalHash){
    var hash = location.hash;
    hash = hash.replace("#", "");
    if(hash == ""){
      changeCenter("typefaces");
    }
    var isTypeface = false;
    var isGear = false;
    var isCustom = false;
    var isCenter = false;
    var isRight = false;
    for(var i = 0; i < typefaceList.length; i++){
      if(hash == typefaceList[i].toLowerCase()){
        isTypeface = true;
      }
    }
    for(var i = 0; i < gearList.length; i++){
      if(hash == gearList[i].toLowerCase()){
        isGear = true;
      }
    }
    for(var i = 0; i < customList.length; i++){
      if(hash == customList[i].toLowerCase()){
        isCustom = true;
      }
    }
    if(isTypeface){
      changeTypeface(hash);
      centerLoaded = false;
      sectionCenter = "typefaces";
    }
    if(isGear){
      changeGear(hash);
      centerLoaded = false;
      sectionCenter = "gear";
    }
    if(isCustom){
      changeCustom(hash);
      centerLoaded = false;
      sectionCenter = "custom";
    }
    if(hash == "typefaces" || hash == "gear" || hash == "custom"){
      isCenter = true;
      changeCenter(hash);
      setTimeout(function(){
        if(overlayOpen){
          closeOverlay();
        }
        if(leftOpen){
          closeLeft();
        }
      }, 100);
    }
    if(hash == "info" || hash == "account" || hash == "checkout"){
      openOverlay(hash);
      isRight = true;
      centerLoaded = false;
      sectionCenter = "typefaces";
      $(".nav li").removeClass("active");
    }
    if(!isTypeface && !isGear && !isCustom && !isRight && !isCenter){
      changeCenter("typefaces");
    }
  }
  internalHash = false;
}


//EVENT LISTENERS AND INTERACTIONS
function initListeners(){

  //START ANIM LOOP
  animMain();

  //CHECK BLOCK SIZES
  resizeBlocks();

  //RESIZE LISTENER
  $(window).on('resize', resize);



  // INFO ––––––––––––––––––––––––––––––––––––––

  //INFO SIDE NAV HIGHLIGHT
  $(".info").scroll(function(){
    var navIndex;

    for(var i = 0; i < $(".info").children(".block").length; i++){
      var offset = $(this).children(".block:eq("+i+")").offset().top - $(window).scrollTop();
      if(offset <= 40 ){
        navIndex = i;
      }
    }
    $(".information--menu li").removeClass("side--nav--selected");
    $(".information--menu li:eq("+navIndex+")").addClass("side--nav--selected");
  });

  //INFO SIDE NAV CONTROLLER
  $(".information--menu li").mousedown(function(){
    var index = $(this).attr("data-info");
    sideNav(index);
  });





  // MISC ––––––––––––––––––––––––––––––––––––––

  //SLIDESHOW ARROW CONTROLLER
  if(!isMobile && !touch){
    $('.section--left').on('mousemove', '.gear--image.slideshow, .custom--image.slideshow', function (e) {

      arrowPos = e.pageY - $(this).offset().top;
      if(arrowPos < 50){
        arrowPos = 50;
      }
      if(arrowPos > ($(this).height() - 50)){
        arrowPos = $(this).height() - 50;
      }
    });
    $('.section--left').on('mouseleave', '.gear--image.slideshow, .custom--image.slideshow', function (e) {
      arrowPos = $(this).height()/2;
    });
  }

  //DROPDOWN MOUSE OUT
  if(!touch){
    $('.wrapper').on('mouseleave', '.dropdown', function (event) {
      $(".dropdown--content").css("height", "0px");
      $(this).children("span").css("transform", "rotate(0DEG)");
    });
  }





  // SECTION CENTER ––––––––––––––––––––––––––––––––––––––

  //CENTER SCROLL LISTENER
  $(".section--center").add(window).scroll(function(){
    if(!isMobile){
      dualScroll();
    } else {
      $(".scroll--right").css("transform", "");
    }
  });

  //TYPEFACE BLOCK CLICK
  $(".block--typeface .block--title").mousedown(function(){
    if(!leftOpen){
      var typefaceName = $(this).parent().attr("data-typeface");
      if(!$(this).parent().hasClass('block--wip')){
        changeTypeface(typefaceName);
      } else {
        $(this).css("opacity", 0);
        $(this).siblings(".notify").css({"opacity": 1, "pointer-events": "auto"});
      }
    }
  });

  //TYPEFACE COMING SOON, NOTIFY
  $(".notify .close").mousedown(function(){
    $(this).parent().parent().css({"opacity": 0, "pointer-events": "none"});
    $(this).parent().parent().siblings(".block--title").css({"opacity": 1});
  });

  //COMING SOON NOTIFY ME
  $('.section--center').on('submit', '.notify form', function (event) {
    event.preventDefault();
    this.submit();
    $(this).children("input:eq(0)").val("");
    $(this).children('.button--submit').val("Submitted!");
    setTimeout(function(){
      $(".notify .button--submit").val("Notify me");
    }, 3000);
  });

  //CUSTOM BLOCK CLICK
  $(".block--custom .block--image").mousedown(function(){
    if(!leftOpen){
      var customName = $(this).parent().attr("data-custom");
      changeCustom(customName);
    }
  });

  //GEAR BLOCK CLICK
  $(".block--gear .block--image").mousedown(function(){
    if(!leftOpen){
      var gearName = $(this).parent().attr("data-gear");
      changeGear(gearName);
    }
  });





  // NAVIGATION ––––––––––––––––––––––––––––––––––––––

  //MENU CONTROLLER
  $(".nav li").mousedown(function(e){
    var dest = $(this).attr("data-dest");
    if(dest == "info" || dest == "account"){
      if(!overlayOpen){
        openOverlay(dest);
        $(this).addClass("active");
      } else {
        if($(this).hasClass("active")){
          if(!sideNavOpen){
            openSideNav();
          }
        } else {
          if(!sideNavOpen){
            openSideNav();
            setTimeout(function(){
              openOverlay(dest);
            }, 500);
          } else {
            openOverlay(dest);
          }
          $(".nav li").removeClass("active");
          $(this).addClass("active");
        }
      }
    } else {
      if(dest == "typefaces" || dest == "gear" || dest == "custom"){
        setTimeout(function(){
          if(!$(this).hasClass("active")){
            changeCenter(dest);
            $(".nav li").removeClass("active");
            $(this).addClass("active");
          }
        }, 100);
        if(overlayOpen){
          closeOverlay();
        }
        if(leftOpen){
          closeLeft();
        }
      }
    }
  });

  //BACK BUTTON/BAR CONTROLLER
  $(".back, .back--button").mousedown(function(){
    if(leftOpen && !overlayOpen){
      closeLeft();
      location.hash = sectionCenter;
      internalHash = true;
      if(!centerLoaded){
        centerLoaded = true;
        changeCenter(sectionCenter);
      }
    }
    if(overlayOpen){
      if(isMobile && !sideNavOpen){
        openSideNav();
      } else {
        closeOverlay();
        if(!centerLoaded){
          centerLoaded = true;
          changeCenter(sectionCenter);
        } else {
          if(!leftOpen){
            $(".back").css({"pointer-events": "none"});
            location.hash = sectionCenter;
            internalHash = true;
          } else {
            location.hash = openFont;
            internalHash = true;
          }
        }
      }
    }
  });

  //BACK BUTTON/BAR HOVER
  $(".back").hover(function(){
    if(overlayOpen){
      $(".menu, .section--right").addClass("hover--left");
    } else {
      if(leftOpen){
        $(".section--left").addClass("hover--right");
      }
    }
  }, function(){
    if(overlayOpen){
      $(".menu, .section--right").removeClass("hover--left");
    }
    if(leftOpen){
      $(".section--left").removeClass("hover--right");
    }
  });

  //CLOSE SIDE NAV (MOBILE)
  $(".info, .account").mousedown(function(){
    if(sideNavOpen){
      closeSideNav();
    }
  });





  // ACCOUNT ––––––––––––––––––––––––––––––––––––––

  //ACCOUNT SIDE NAV CONTROLLER
  $(".side--nav").on('mousedown', '.account--menu li', function(){
    if(signedIn){
      var index = $(this).attr("data-info");
      $(".account--menu li").removeClass("side--nav--selected");
      $(this).addClass("side--nav--selected");
      if(index != accountOpen){
        changeAccount(index);
      }
    }
  });

  //ACCOUNT SIGN UP
  $(".account--signin .signup .button--submit").mousedown(function(){
    changeAccount("signup");
  });

  //ACCOUNT ORDERS EXPAND
  $('.account').on('click', '.account--orders .order', function (e) {
    $(".account--orders .order").css("height", "40px");
    $(this).css("height", ($(this).children(".order--items").outerHeight() + $(this).children(".order--details").outerHeight() + 40) + "px");
  });

  //ACCOUNT DETAILS EDIT
  $(".account--edit").mousedown(function(){
    if($(this).text() == "Edit"){
      $(this).parent().parent().css({"min-height": $(this).parent().parent().outerHeight() + "px", "height": $(this).parent().parent().outerHeight() + "px"});
      $(this).parent().siblings(".account--update").fadeIn();
      if(isMobile){
        $(this).parent().parent().css("height", ($(this).parent().siblings(".account--update").outerHeight() + $(this).parent().outerHeight() + 70) + "px");
      } else {
        $(this).parent().parent().css("height", $(this).parent().siblings(".account--update").outerHeight() + "px");
      }
      $(this).text("Cancel");
    } else {
      $(this).parent().siblings(".account--update").fadeOut();
      $(this).parent().parent().css({"height": $(this).parent().parent().css("min-height"), "min-height": ""});
      $(this).text("Edit");
    }
  });

  $(".forgot--password").mousedown(function(){
    $(this).siblings(".forgot--password--form").addClass("show");
  });





  // CHECKOUT ––––––––––––––––––––––––––––––––––––––

  //CART CLICK
  $(".cart").mousedown(function(){
    $(".nav li").removeClass("active");
    openOverlay("checkout");
    changeCheckout("cart");
  });

  //OPEN MOBILE CHECKOUT
  $(".cart--checkout--button").mousedown(function(){
    $(".back--right").css({"opacity": 0, "pointer-events": "none"});
    if($(".checkout--cart .cart--item").length > 0){
      if(signedIn){
        changeCheckout("details");
      } else {
        changeCheckout("signin");
      }
      $(".checkout").css({"display": "block"});
      setTimeout(function(){
        $(".checkout").css({"opacity": 1});
      }, 50);
    }
  });

  //CHECKOUT SIGN UP
  // $(".checkout--signin .signup .button--submit").mousedown(function(){
  //   signedIn = false;
  //   changeCheckout("details");
  // });

  //CHECKOUT SIGN IN
  // $(".checkout--signin .signin--input .button--submit").mousedown(function(e){
  //   e.preventDefault();
  //   signedIn = true;
  //   changeCheckout("details");
  // });

  $(".checkout--input .edit").mousedown(function(){
    var that = $(this);
    if(that.text() == "Edit"){
      that.parent().siblings(".checkout--saved").css({"opacity": 0});
      that.text("Cancel");
      setTimeout(function(){
        that.parent().parent().css({"min-height": that.parent().parent().outerHeight() + "px", "height": that.parent().parent().outerHeight() + "px"});
        that.parent().siblings(".checkout--new").fadeIn();
        if(isMobile){
          that.parent().parent().css("height", (that.parent().siblings(".checkout--new").outerHeight() + that.parent().outerHeight() + 70) + "px");
        } else {
          that.parent().parent().css("height", (that.parent().siblings(".checkout--new").outerHeight() + (parseInt(padding) * 2)) + "px");
        }
      }, 500);
    } else {
      that.parent().siblings(".checkout--new").fadeOut();
      that.parent().parent().css({"height": that.parent().parent().css("min-height"), "min-height": ""});
      that.text("Edit");
      setTimeout(function(){
        that.parent().siblings(".checkout--saved").css({"opacity": 1});
      }, 500);
    }
  });





  // TYPEFACE PAGE ––––––––––––––––––––––––––––––––––––––

  //TYPETESTER SIZE CALC
  $('.section--typeface').on('input', '.input', function (event) {
    typetesterSize();
  });

  //TYPETESTER FONT SIZE SLIDER
  $('.section--typeface').on('input', '#font--size', function (event) {
    var val = $(this).val();
    typetesterFontSize(val);
  });

  //TYPETESTER VARIABLE SLIDER
  $('.section--typeface').on('input', '.slider--variable', function (event) {
    var index = $(this).index(".slider--variable");
    variableCurr[index] = $(this).val();
    $(this).siblings(".value").text($(this).val());
    var varString = "";
    for(var i = 0; i < variableCurr.length; i++){
      if(i != 0){
        varString += ", "
      }
      varString += "'" + variableAxis[i][0] + "' " + variableCurr[i];
    }
    $(".input").css({"font-variation-settings": varString});
    typetesterSize();
  });

  //GLYPH GRID MOBILE
  if(isMobile){
    var charTimeout;
    $(".char--grid td").mousedown(function(){
      clearTimeout(charTimeout);
      $(".char--grid td").css({"font-size": "3vh", "line-height": "3vh", "padding": "0vh"});
      $(this).css({"font-size": "25vh", "line-height": "25vh", "padding": "4vh"});
      charTimeout = setTimeout(function(){
        $("t.char--grid td").css({"font-size": "3vh", "line-height": "3vh", "padding": "0vh"});
      }, 5000);
    });
  }

  //WEIGHT DROPDOWN CONTROLLER
  $('.section--typeface').on('click', '.dropdown--weight .dropdown--content li', function (event) {
    currWeight = $(this).attr("data-weight");
    if(currWeight == "variable"){
      variableSelected = true;
      $(".dropdown--variable").css({"opacity": 1, "pointer-events": "auto"});
    } else {
      variableSelected = false;
      $(".dropdown--variable").css({"opacity": 0, "pointer-events": "none"});
    }
    if(isMobile){
      $(".dropdown--content").css("height", "0px");
      $(".dropdown--content").siblings("span").css("transform", "rotate(0DEG)");
    }
    $(".dropdown--weight .button").text(this.innerHTML);
    updateFont(".input, .char--grid td");
    typetesterSize();
  });

  //WIDTH DROPDOWN CONTROLLER
  $('.section--typeface').on('click', '.dropdown--width .dropdown--content li', function (event) {
    currWidth = $(this).attr("data-width");
    if($(this).attr("data-widthInt") == "true"){
      $(".dropdown--width .button").text("Width " + this.innerHTML);
    } else {
      $(".dropdown--width .button").text(this.innerHTML);
    }
    if(isMobile){
      $(".dropdown--content").css("height", "0px");
      $(".dropdown--content").siblings("span").css("transform", "rotate(0DEG)");
    }
    updateFont(".input, .char--grid td");
    typetesterSize();
  });

  //OPENTYPE DROPDOWN
  $('.section--typeface').on('click', '.opentype .dropdown--content li', function (event) {
    var sets = "";
    $(this).toggleClass("dropdown--selected");
    $(".opentype .dropdown--content li").each(function(index){
      if($(this).hasClass("dropdown--selected")){
        if(sets == ""){
          sets = "'ss" + pad(index + 1, 2) + "'";
        } else {
          sets += ", 'ss" + pad(index + 1, 2) + "'";
        }
      }
    });
    $(".input, .char--grid td").css({"font-feature-settings": sets});
  });
  $('.section--typeface').on('mouseover', '.opentype .dropdown--content li', function (event) {
    $(this).children(".opentype--set").css("opacity", 0);
    $(this).children(".opentype--alt").css("opacity", 1);
  });

  $('.section--typeface').on('mouseout', '.opentype .dropdown--content li', function (event) {
    $(this).children(".opentype--set").css("opacity", 1);
    $(this).children(".opentype--alt").css("opacity", 0);
  });

  //CAPS LOCK
  $('.section--typeface').on('click', '.toggle--uppercase', function (event) {
    $(this).toggleClass("button--selected");
    $(".input, .char--grid td").toggleClass("capslock");
    if(caps == true){
      caps = false;
    } else {
      caps = true;
    }
    typetesterSize();
  });

  //ITALIC TOGGLE
  $('.section--typeface').on('click', '.controls .toggle--italic', function (event) {
    $(this).toggleClass("button--selected");

    if(italicSelected){
      italicSelected = false;
    } else {
      italicSelected = true;
      if(monoSelected){
        monoSelected = false;
        $(".controls .toggle--mono").removeClass("button--selected");
        $(".dropdown--weight li").hide();
        for(var i = 0; i < weightVals.length; i++){
          for(var j = 0; j < weights.length; j++){
            if($(".dropdown--weight li:eq("+j+")").attr("data-weight") == weightVals[i]){
              $(".dropdown--weight li:eq("+j+")").show();
            }
          }
        }
      }
    }
    updateFont(".input, .char--grid td");
  });

  //MONO TOGGLE
  $('.section--typeface').on('click', '.controls .toggle--mono', function (event) {
    $(this).toggleClass("button--selected");

    if(monoSelected){
      monoSelected = false;
      $(".dropdown--weight li").hide();
      for(var i = 0; i < weightVals.length; i++){
        for(var j = 0; j < weights.length; j++){
          if($(".dropdown--weight li:eq("+j+")").attr("data-weight") == weightVals[i]){
            $(".dropdown--weight li:eq("+j+")").show();
          }
        }
      }
    } else {
      monoSelected = true;
      if(italicSelected){
        italicSelected = false;
        $(".controls .toggle--italic").removeClass("button--selected");
      }
      $(".dropdown--weight li").hide();
      var check = false;
      for(var i = 0; i < isMono.length; i++){
        for(var j = 0; j < weights.length; j++){
          if($(".dropdown--weight li:eq("+j+")").attr("data-weight") == isMono[i]){
            $(".dropdown--weight li:eq("+j+")").show();
            if(weights[j] == currWeight){
              check = true;
            }
          }
        }
      }
      if(!check){
        currWeight = "regular";
        $(".dropdown--weight .button").text("Regular");
      }
    }
    updateFont(".input, .char--grid td");
  });

  //CONTROL HEIGHT
  $(".section--left").scroll(function(){
    if($(".section--left").scrollTop() <= $(".typetester").outerHeight() - 130){
      $(".controls").css({"transform": "translate(0, "+ $(".section--left").scrollTop() +"px)"});
    }
  });

  //ITALIC TOGGLE WEIGHT SECTION
  $('.section--typeface').on('click', '.weight--controls .toggle--italic', function (event) {
    $(this).toggleClass("button--selected");

    if(italicSelectedW){
      italicSelectedW = false;
    } else {
      italicSelectedW = true;
      if(monoSelectedW){
        monoSelectedW = false;
        $(".weight--controls .toggle--mono").removeClass("button--selected");
      }
    }
    updateWeightBlock("");
  });

  //MONO TOGGLE WEIGHT SECTION
  $('.section--typeface').on('click', '.weight--controls .toggle--mono', function (event) {
    $(this).toggleClass("button--selected");

    if(monoSelectedW){
      monoSelectedW = false;
    } else {
      monoSelectedW = true;
      if(italicSelectedW){
        italicSelectedW = false;
        $(".weight--controls .toggle--italic").removeClass("button--selected");
      }
    }
    updateWeightBlock("");
  });

  //XRAY MODULE
  if(touch){

    //MOBILE CONTROLS

    //XRAY TOUCH START
    $('.section--typeface').on('touchstart', '.typeface--interact2', function (e) {
      var x = touch.pageX - $(".xray--wrapper").offset().left;
      var y = touch.pageY - $(".xray--wrapper").offset().top - 50;
      $(".xray--div").css({"transform": "translate3d(calc("+ (x) +"px - 50%), calc("+ (y) +"px - 50%), 0)", "height": "200px", "width": "200px"});
    });
    //XRAY TOUCH MOVE
    $('.section--typeface').on('touchmove', '.typeface--interact2', function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      var x = touch.pageX - $(".xray--wrapper").offset().left;
      var y = touch.pageY - $(".xray--wrapper").offset().top - 50;
      $(".xray--div").css({"transform": "translate3d(calc("+ (x) +"px - 50%), calc("+ (y) +"px - 50%), 0)", "opacity": "1"});
      $(".xray--front").css({"transform": "translate3d(calc(-50% + "+ (-x*2 + $(".xray--wrapper").innerWidth()) +"px), calc(-50% + "+ (-y*2 + $(".xray--wrapper").innerHeight()) +"px), 0)"});
    });
    //XRAY TOUCH END
    $('.section--typeface').on('touchend', '.typeface--interact2', function (e) {
      var x = touch.pageX - $(".xray--wrapper").offset().left;
      var y = touch.pageY - $(".xray--wrapper").offset().top - 50;
      $(".xray--div").css({"transform": "translate3d(calc("+ (x) +"px - 50%), calc("+ (y) +"px - 50%), 0)", "height": "100px", "width": "100px"});
    });
  } else {

    //DESKTOP CONTROLS

    //XRAY MOVE
    $('.section--typeface').on('mousemove', '.typeface--interact2', function (e) {
      var x = e.pageX - $(".xray--wrapper").offset().left;
      var y = e.pageY - $(".xray--wrapper").offset().top;
      $(".xray--div").css({"transform": "translate3d(calc("+ (x) +"px - 50%), calc("+ (y) +"px - 50%), 0)", "opacity": "1"});
      $(".xray--front").css({"transform": "translate3d(calc(-50% + "+ (-x*2 + $(".xray--wrapper").innerWidth()) +"px), calc(-50% + "+ (-y*2 + $(".xray--wrapper").innerHeight()) +"px), 0)"});
    });
    //XRAY ZOOM IN
    $('.section--typeface').on('mousedown', '.typeface--interact2', function (e) {
      click = true;
      var x = e.pageX - $(".xray--wrapper").offset().left;
      var y = e.pageY - $(".xray--wrapper").offset().top;
      $(".xray--div").css({"transform": "translate3d(calc("+ (x) +"px - 50%), calc("+ (y) +"px - 50%), 0)", "height": "400px", "width": "400px"});
    });
    //XRAY ZOOM OUT
    $('.section--typeface').on('mouseup', '.typeface--interact2', function (e) {
      click = false;
      var x = e.pageX - $(".xray--wrapper").offset().left;
      var y = e.pageY - $(".xray--wrapper").offset().top;
      $(".xray--div").css({"transform": "translate3d(calc("+ (x) +"px - 50%), calc("+ (y) +"px - 50%), 0)", "height": "200px", "width": "200px"});
    });
  }

  //TYPE SPECIMEN SHOP LINK
  $('.section--typeface').on('click', '.link--specimen', function (event) {
    var id = $(this).attr("data-name");
    changeGear(id);
  });

  //DROPDOWN BUTTONS
  $('.wrapper').on('click', '.dropdown button', function (event) {
    if($(this).siblings("ul").height() == 0){
      $(".button").siblings("ul").css("height", "0px");
      var l = 0;
      for(var i = 0; i < $(this).siblings("ul").children("li").length; i++){
        if($(this).siblings("ul").children("li:eq("+i+")").css("display") != "none"){
          l++;
        }
      }
      $(this).siblings("ul").css("height", (l * inputHeight) + "px");
      $(this).siblings("span").css("transform", "rotate(180DEG)");
    } else {
      $(this).siblings("ul").css("height", "0px");
      $(this).siblings("span").css("transform", "rotate(0DEG)");
    }
  });

  //TOGGLE WEIGHT MODULES
  $('.section--typeface').on('click', '.weight--button--stack, .weight--button--custom', function (event) {
    if(!$(this).hasClass("button--selected")){
      $(this).toggleClass("button--selected");
      $(this).siblings(".button").toggleClass("button--selected");
      $(this).parent().parent().siblings(".block").toggleClass("weight--swap");
    }
  });

  //CHANGE WEIGHT MODULE WORD SET
  $('.section--typeface').on('click', '.weight--stack', function (event) {
    updateWeightWords();
  });

  //WEIGHT MODULE LERP
  if(!touch){
    $('.section--typeface').on('mousemove', '.weight--text', function (e) {
      if(!lerpWait){
        var y = e.pageY - $(this).offset().top;
        var w = weightVals.length;
        if(weightVals.length <= 1){
          w = wordSets[0].length;
        }
        if(isMono != false){
          w = isMono.length;
        }
        for(var i = 0; i < w; i++){
          var pos = $(".weight--text h1:eq("+i+")").offset().top - $(this).offset().top;
          var offset = Math.pow(Math.sin(1 - Math.abs(y - pos)/$(this).outerHeight()), 6);
          var lerp;
          lerp = parseInt($(".weight--text h1:eq("+i+")").css("line-height")) + (((parseInt(titleSize) + (offset * 5)) * window.innerHeight / 100) - parseInt($(".weight--text h1:eq("+i+")").css("line-height")))/5;
          $(".weight--text h1:eq("+i+")").css({"line-height": lerp + "px"})
        }

        lerpWait = true;
        setTimeout(function(){
          lerpWait = false;
        }, 30);
      }
    });

    $('.section--typeface').on('mouseover', '.weight--text', function (e) {
        $(".weight--text h1").css({"transition": "none"});
    });

    $('.section--typeface').on('mouseout', '.weight--text', function (e) {
      $(".weight--text h1").css({"transition": "line-height 0.5s","line-height": (parseInt(titleSize)) + "vh"});
    });
  }

  // SELECT HOVER
  $('.section--typeface').on('mouseover', '.selection--list .name', function(){
    $(this).animate({scrollLeft: 100},{
      queue       : false,
      duration    : 1000
    });
  });
  $('.section--typeface').on('mouseout', '.selection--list .name', function(){
    $(this).animate({scrollLeft: 0}, {
      queue       : false,
      duration    : 1000
    });
  });

  //TRIAL FONT EULA AGREE CHECK
  $('.section--typeface').on('click', '#te, #te--m', function (event) {
    if($(this).is(':checked')){
      $(".trial--input .button--submit").removeAttr("disabled");
    } else {
      $(".trial--input .button--submit").attr("disabled", "disabled");
    }
  });

  //TRIAL FONTS REQUEST
  $('.section--typeface').on('submit', '.trial--input', function (event) {

    event.preventDefault();
    this.submit();

    $(this).children('#trial_name').val("");
    $(this).children('#trial_email').val("");
    $(this).children('.trial--eula').children("input").prop( "checked", false );
    $(".trial--input .button--submit").attr("disabled", "disabled");
    $(".trial--input .button--submit").val("Submitted!");

    setTimeout(function(){
      $(".trial--input .button--submit").val("Submit");
    }, 3000);

  });





  // GEAR PAGE ––––––––––––––––––––––––––––––––––––––

  //CHANGE SLIDESHOW IMAGE
  $('.section--gear').on('click', '.slideshow--index .button', function (event) {
    index = $(this).index(".slideshow--index .button");
    $(".gear--slideshow").slick("slickGoTo", index);
  });

}


//OPEN LEFT SECTION
function openLeft(section){
  $(".section--left").scrollTop(0);
  $(".section--left").children().hide();
  $(".section--" + section).show();
  if(!isMobile){
    $("body").css("overflow", "hidden");
  }
  $(".back").css({"pointer-events": "auto"});
  $(".back--left").css({"opacity": 1, "pointer-events": "auto"});
  $(".back--arrow").css({"opacity": 1});
  $(".section--left").addClass("shift--right");
  leftOpen = true;
  setTimeout(function(){
    $(".section--center").css({"opacity": 0});
  }, 500);
}


//CLOSE LEFT SECTION
function closeLeft(){
  if(!isMobile){
    $("body").css("overflow", "auto");
  }
  $(".back").css({"pointer-events": "none"});
  $(".back--left").css({"opacity": 0, "pointer-events": "none"});
  $(".back--arrow").css({"opacity": 0});
  $(".section--left").removeClass("shift--right");
  $(".section--left").removeClass("hover--right");
  $(".section--center").css({"opacity": 1});
  leftOpen = false;
}


//OPEN OVERLAY
function openOverlay(dest){

  location.hash = dest;
  internalHash = true;

  $(".back").css({"width": "90px", "left": "-90px", "pointer-events": "auto"});
  $(".back--right").css({"opacity": 1, "pointer-events": "auto"});
  $(".back--arrow").addClass("back--arrow--right");
  $(".back--arrow").css({"opacity": 1});
  $(".nav li").css("font-weight", "");
  $(".menu, .section--right").addClass("shift--left");
  if(leftOpen && isMobile){
    $(".back--left").css({"opacity": 0, "pointer-events": "none"});
  }
  setTimeout(function(){
    $(".section--center").css({"opacity": 0});
    if(leftOpen){
      $(".section--left").css({"opacity": 0});
    }
  }, 500);
  if(!isMobile){
    $("body").css("overflow-y", "hidden");
  }
  if(dest != "checkout"){
    openSideNav();
  }
  if(!overlayOpen){
    $(".section--account, .section--info, .section--checkout").css("transition", "none");
  }
  overlayOpen = true;
  if(dest == "info"){
    $(".section--account, .section--checkout").addClass("overlay--hidden--down");
    if($(".section--account").hasClass("overlay--hidden--up")){
      $(".section--account").css("transition", "none");
      $(".section--account").removeClass("overlay--hidden--up");
    }
    $(".section--info").removeClass("overlay--hidden--up");
    $(".nav li:eq(3)").css("font-weight", 500);
  }
  if(dest == "account"){
    $(".section--info").addClass("overlay--hidden--up");
    $(".section--checkout").addClass("overlay--hidden--down");
    $(".section--account").removeClass("overlay--hidden--up");
    $(".section--account").removeClass("overlay--hidden--down");
    $(".nav li:eq(4)").css("font-weight", 500);
  }
  if(dest == "checkout"){
    // changeCheckout("cart");
    $(".section--info, .section--account").addClass("overlay--hidden--up");
    if($(".section--account").hasClass("overlay--hidden--down")){
      $(".section--account").css("transition", "none");
      $(".section--account").removeClass("overlay--hidden--down");
      setTimeout(function(){
        $(".section--account").css("transition", "");
      }, 50);
    }
    $(".section--checkout").removeClass("overlay--hidden--down");
  }
  setTimeout(function(){
    $(".section--account, .section--info, .section--checkout").css("transition", "");
  }, 500);
}


//CLOSE OVERLAY
function closeOverlay(){
  $(".back").css({"width": "60px", "left": "-60px"});
  $(".back--right").css({"opacity": 0, "pointer-events": "none"});
  $(".back--arrow").removeClass("back--arrow--right");
  $(".nav li").css("font-weight", "");
  if(leftOpen){
    $(".section--left").css({"opacity": 1});
    $(".back--left").css({"opacity": 1, "pointer-events": "auto"});
  } else {
    $(".back--arrow").css({"opacity": 0});
    $(".section--center").css({"opacity": 1});
  }
  $(".menu, .section--right").removeClass("shift--left");
  $(".menu, .section--right").removeClass("hover--left");
  if(!isMobile){
    $("body").css("overflow-y", "auto");
  }
  overlayOpen = false;
  $(".nav li").removeClass("active");
  $(".nav li").each(function(){
    if($(this).attr("data-dest") == sectionCenter){
      $(this).css("font-weight", 500);
    }
  });
}

//MOBILE OPEN SIDE NAV
function openSideNav(){
  sideNavOpen = true;
  $(".info, .account, .section--info .side--nav, .section--account .side--nav").addClass("side--nav--open");
}

//MOBILE CLOSE SIDE NAV
function closeSideNav(){
  sideNavOpen = false;
  $(".info, .account, .section--info .side--nav, .section--account .side--nav").removeClass("side--nav--open");
}

//SET SCROLL FOR INFO PAGE
function sideNav(index){
  var offset = $(".info").children(".block:eq("+index+")").offset().top + $(".info").scrollTop() - $(window).scrollTop() + 1;
  $(".info").animate({scrollTop: offset}, 500 , function(){
    closeSideNav();
  });
}


//LOAD ACCOUNT PAGE
function changeAccount(dest){
  $(".account--" + accountOpen).css("opacity", 0);
  $(".account--" + dest).css("display", "block");
  setTimeout(function(){
    $(".account--" + accountOpen).css("display", "none");
    $(".account--" + dest).css("opacity", 1);
    accountOpen = dest;
  }, 500);
}


//LOAD CHECKOUT PAGE
function changeCheckout(dest){
  if(dest != checkoutOpen){
    if(dest == "details"){
      var shipping = false;
      $(".cart--summary .cart--item").each(function(){
        if($(this).attr('data-type') == 'gear'){
          shipping = true;
        }
      });

      if(shipping){
        $(".details--shipping--address").show();
        $("#shipping_required").val('true');
      } else {
        $(".details--shipping--address").hide();
        $("#shipping_required").val('false');
      }

      $(".checkout--saved, .signup--hide").hide();
      $(".checkout--page").each(function(){

      });

    } else if('cart'){

    }
    $(".checkout--" + checkoutOpen).css("opacity", 0);
    $(".checkout--" + dest).css("display", "block");
    setTimeout(function(){
      $(".checkout--" + checkoutOpen).css("display", "none");
      $(".checkout--" + dest).css("opacity", 1);
      checkoutOpen = dest;
    }, 500);
  }
}


//SWAP CENTER SECTION
function changeCenter(id){
  centerChange = true;
  location.hash = id;
  internalHash = true;

  $(".section--center").children().css({"opacity": 0, "pointer-events": "none"});
  $(".nav li").css("font-weight", "");
  if(id == "typefaces"){
    $(".nav li:eq(0)").css("font-weight", 500);
  }
  if(id == "gear"){
    $(".nav li:eq(2)").css("font-weight", 500);
  }
  if(id == "custom"){
    $(".nav li:eq(1)").css("font-weight", 500);
  }

  setTimeout(function(){
    $(".section--center").children().css({"display": "none"});
    if(id == "typefaces"){
      $(".homepage").css({"display": "block"});
    }
    if(id == "gear"){
      $(".gear").css({"display": "block"});
    }
    if(id == "custom"){
      $(".custom").css({"display": "block"});
    }
  }, 500);

  setTimeout(function(){
    $(".section--center").children().css({"display": "none"});
    if(id == "typefaces"){
      $(".homepage").css({"opacity": 1, "pointer-events": "auto", "display": "block"});
      sectionCenter = "typefaces";
    }
    if(id == "gear"){
      $(".gear").css({"opacity": 1, "pointer-events": "auto", "display": "block"});
      sectionCenter = "gear";
    }
    if(id == "custom"){
      $(".custom").css({"opacity": 1, "pointer-events": "auto", "display": "block"});
      sectionCenter = "custom";
    }

    if(!isMobile){
      $(window).scrollTop(0);
      dualScroll();
      centerChange = false;;
    } else {
      $(".section--center").scrollTop(0);
    }

  }, 550);
}


//LOAD TYPEFACE PAGE
function changeTypeface(typefaceName){

  location.hash = typefaceName;
  internalHash = true;

  openFont = typefaceName;

  var displayName = typefaceData[openFont].displayName;
  weightVals = typefaceData[openFont].weights;
  isItalic = typefaceData[openFont].italic;
  isVariable = typefaceData[openFont].variable;
  variableAxis = typefaceData[openFont].variableAxis;
  widths = typefaceData[openFont].width;
  isMono = typefaceData[openFont].mono;
  var desc = typefaceData[openFont].description;
  var details = typefaceData[openFont].details;
  var styleSets = typefaceData[openFont].styleSets;
  var specimen = typefaceData[openFont].specimen;
  var microsite = typefaceData[openFont].microsite;
  wordSets = typefaceData[openFont].wordSets;
  var custom = typefaceData[openFont].customBlock;

  var sorting = weights;
  var weightValsnew = mapOrder(weightVals, sorting);

  console.log(widths);

  var sorting = ['normal', 'expanded', 'extended'];
  widths = mapOrder(widths, sorting);

  $.get('php/typeface.php', {

    name: openFont,
    displayName: displayName,
    weightVals: weightVals,
    widths: widths,
    mono: isMono,
    italic: isItalic,
    variable: isVariable,
    variableAxis: variableAxis,
    desc: desc,
    details: details,
    styleSets: styleSets,
    specimen: specimen,
    microsite: microsite,
    wordSet: wordSets[0],
    custom: custom

  }, function(response) {
    $(".section--typeface").html(response);

    setTimeout(function(){

      $('.marquee').each(function(i){
        if($(this).children().length != 0){
          $(this).marquee('destroy');
        }

        var w = $(this).width();
        $(this).width(w);
        var s = w * 10;

        $mq = $(this).marquee({
          duplicated: true,
          duration: s,
          startVisible: true,
          gap: 50
        });

      });

    }, 500);

    $('.animated--type').each(function () {
      var strings = $(this).attr('data-strings').split(';#$#;');
      var speed = $(this).attr('data-speed');
      var delay = $(this).attr('data-delay');
      var back_delay = $(this).attr('data-back-delay');
      var back_speed = $(this).attr('data-back-speed');
      var loop = $(this).attr('data-loop');
      if (loop == 'yes')
        loop = true
      else
        loop = false;

      var cursor = $(this).attr('data-cursor');
      if (cursor == 'yes')
        cursor = true
      else
        cursor = false;

      var cursor_char = $(this).attr('data-cursor-char');

      $(this).typed({
        strings: strings,
        typeSpeed: parseInt(speed),
        startDelay: parseInt(delay),
        backSpeed: parseInt(back_speed),
        backDelay: parseInt(back_delay),
        loop: loop,
        showCursor: cursor,
        cursorChar: cursor_char,
      });

    });

    openLeft("typeface");
    resizeBlocks();
    typetesterFontSize();

    if(custom){
      $(".weight--custom").load("weightModules/"+ openFont +".html");
    }

    if(widths.length == 0){
      currWidth = 'normal';
    } else {
      currWidth = $(".controls .dropdown--width button").text().toLowerCase();
      currWidth2 = $(".controls .dropdown--width button").text().toLowerCase();
    }

    currWeight = $(".controls .dropdown--weight button").text().toLowerCase();

    if(isVariable){
      currWeight = "variable";
      currWidth = widths[0];
      currWidth2 = widths[0];
    }

  });


  monoSelected = false;
  italicSelected = false;
  monoSelectedW = false;
  italicSelectedW = false;
  // currWidth = widths[0];
  caps = false;
  weightWordsIndex = 0;
  variableSelected = false;
  if(isVariable){
    variableSelected = true;
    variableCurr = [];
    for(var i = 0; i < variableAxis.length; i++){
      variableCurr[i] = variableAxis[i][3];
    }
  }
}

function updateFont(c){
  var font = openFont;
  if(monoSelected){
    font += "mono"
  }
  font += "--" + currWeight;
  currWidth = currWidth.toLowerCase();
  if(widths.length > 0 && currWidth != 'normal'){
    font += currWidth;
  }
  if(italicSelected){
    font += "--italic";
  }
  var classes = $(".input").attr("class");
  classes = classes.replace("input ", "");
  if(c == ".char--char"){
    classes = $(".char--char").attr("class");
    classes = classes.replace("char--char", "");
  }
  $(c).removeClass(classes);
  $(c).addClass(font);
  if(caps){
    $(c).addClass("capslock");
  }
}

function updateWeightBlock(char){

  if(char == ""){
    char = $(".char--char h1:eq(0)").text();
  }

  var weightWords;
  var index = weightWordsIndex - 1;
  if(index < 0){
    index = wordSets.length;
  }
  if(index == wordSets.length){
    weightWords = weightVals;
    if(monoSelectedW){
      weightWords = isMono;
    }
  } else {
    weightWords = wordSets[index];
  }

  if(weightVals.length > 1){

    $(".weight--buttons, .weight--button--stack").show();

    $.get('php/typeWeights.php', {

      name: openFont,
      weightVals: weightVals,
      widths: widths,
      currWidth: currWidth2,
      mono: monoSelectedW,
      monoWeights: isMono,
      italic: italicSelectedW,
      wordSet: weightWords

    }, function(response) {
      $(".weight--text").html(response);
    });

  } else {
    $(".weight--buttons, .weight--button--stack").hide();
    $(".weight--stack, .weight--char").addClass("weight--swap");
  }

  weightStackChar(char);
}

function updateWeightWords(){
  var weightWords;
  if(weightWordsIndex == wordSets.length){
    weightWords = weightVals;
    if(monoSelectedW){
      weightWords = isMono;
    }
    weightWordsIndex = 0;
    if(weightVals.length <= 1){
      weightWords = wordSets[weightWordsIndex];
      weightWordsIndex++;
    }
  } else {
    if(weightVals.length <= 1 && weightWordsIndex == 0){
      weightWordsIndex++;
    }
    weightWords = wordSets[weightWordsIndex];
    weightWordsIndex++;
  }
  $(".weight--text h1").each(function(index){
    $(this).text(weightWords[index]);
  });

}

function weightStackChar(char){

  $.get('php/typeWeights2.php', {

    name: openFont,
    weightVals: weightVals,
    widths: widths,
    currWidth: currWidth2,
    mono: monoSelectedW,
    monoWeights: isMono,
    italic: italicSelectedW,
    char: char

  }, function(response) {
    $(".char--char").html(response);
  });
}

function updateTypeList(){
  $.get('php/typeList.php', {

    name: openFont,
    weightVals: weightVals,
    widths: widths,
    mono: isMono,
    monoWeights: monoWeightVals,
    italic: isItalic

  }, function(response) {
    $(".selection--list").html(response);
  });
}

function typetesterSize(){
  if($('.input').height() > 0.7*$('.input').parent().height()){
    $('.input').addClass("input--big");
  } else {
    $('.input').removeClass("input--big");
  }
}

function typetesterFontSize(){
  var val = $(".size--slider").val();
  var valPos = (((val-12)/188)*165-100);
  if(isMobile){
    val = Math.round(val/1.5 + 3);
  }
  if(window.innerWidth < 1400){
    valPos *= 0.75;
  }
  $(".input").css({"font-size": val + "pt", "line-height": val*1.2 + "pt"});
  $(".control--size .slider--val").css("transform", "translate(" + valPos + "px, 0)");
  $(".control--size .slider--val").text(val + "pt");
  typetesterSize();
}



//LOAD CUSTOM PROJECT PAGE
function changeCustom(customName){

  location.hash = customName;
  internalHash = true;
  openCustom = customName;

  var displayName = customData[customName].displayName;
  var desc1 = customData[customName].desc1;
  var desc2 = customData[customName].desc2;
  var year = customData[customName].year;
  var details = customData[customName].details;
  var slideImgCount = customData[customName].slideImgCount;
  var slideLand = customData[customName].slideshowLandscape;
  var blockColors = customData[customName].blockColors;

  $(".custom--slideshow").slick('unslick');

  $(".section--custom").html("");

  $.get('php/custom.php', {

    name: customName,
    displayName: displayName,
    desc1: desc1,
    desc2: desc2,
    year: year,
    details: details,
    slideImgCount: slideImgCount,
    slideLand: slideLand,
    blockColors: blockColors

  }, function(response) {
    $(".section--custom").append(response);

    $('.custom--slideshow').slick({
      infinite: true,
      slidesToScroll: 1,
      variableWidth: true,
      initialSlide: 0,
      prevArrow: $('.custom--slideshow').siblings(".prev--arrow"),
      nextArrow: $('.custom--slideshow').siblings(".next--arrow")
    });
    $('.custom--slideshow').slick("slickGoTo", 0, false);

    openLeft("custom");
    resizeBlocks();

  });

}

//LOAD GEAR PAGE
function changeGear(gearName){

  location.hash = gearName;
  internalHash = true;
  openGear = gearName;

  var displayName = gearData[gearName].displayName;
  var desc = gearData[gearName].description;
  var price = gearData[gearName].price;
  var imgCount = gearData[gearName].imgCount;
  var slideLand = gearData[gearName].slideshowLandscape;

  $(".gear--slideshow").slick('unslick');
  $(".section--gear").html("");

  $.get('php/gear.php', {

    name: gearName,
    displayName: displayName,
    desc: desc,
    slideImgCount: imgCount,
    slideLand: slideLand,
    price: price

  }, function(response) {
    $(".section--gear").append(response);

    $('.gear--slideshow').slick({
      infinite: true,
      slidesToScroll: 1,
      variableWidth: true,
      initialSlide: 0,
      prevArrow: $('.gear--slideshow').siblings(".prev--arrow"),
      nextArrow: $('.gear--slideshow').siblings(".next--arrow")
    });
    $('.gear--slideshow').slick("slickGoTo", 0, false);
    $('.gear--slideshow').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      $(".slideshow--index .button").removeClass("slideshow--index--selected");
      $(".slideshow--index .button:eq(" + nextSlide + ")").addClass("slideshow--index--selected");
    });

    openLeft("gear");
    resizeBlocks();

  });

}


//CENTER SECTION SCROLLING
function dualScroll(){
  if(!centerChange){
    var sh = $(".homepage .scroll--left").height() - window.innerHeight;
    if(sectionCenter == "gear"){
      sh = $(".gear .scroll--left").height() - window.innerHeight;
    }
    if(sectionCenter == "custom"){
      sh = $(".custom .scroll--left").height() - window.innerHeight;
    }

    if ( $(window).scrollTop() >= sh ) {
      $(window).scrollTop(1);

    }
    else if ( $(window).scrollTop() == 0 ) {
      $(window).scrollTop(sh - 1);
    }

    if(!leftOpen && !cartOpen){
      $(".scroll--right").css({"transform": "translate3d(0, " + ((((sh) - $(window).scrollTop())* -1)) + "px, 0)"});
    }
  }
}

//MOBILE RESIZE BLOCKS TO PX
function resizeBlocks(){
  if(touch){
    $(".block--25").not(".block--extend").css("height", window.innerHeight*0.25 + "px");
    $(".block--50").not(".block--extend").css("height", window.innerHeight*0.5 + "px");
    $(".block--75").not(".block--extend").css("height", window.innerHeight*0.75 + "px");
    $(".block--100").not(".block--extend").css("height", window.innerHeight + "px");
  }
  blockExtend();
}

//RESIZE BLOCKS TO CONTENT
function blockExtend(){
  if(!isMobile){
    $(".block--extend--opposite").each(function(){
      $(this).css({"height": $(this).siblings(".block--extend").outerHeight() + "px"});
    });
  }
}

//RESIZE HANDLER
function resize(){
  scaling();
  resizeBlocks();
}


//ANIMATION LOOP
function animMain(){

  if(!touch && leftOpen){
    arrowDest += (arrowPos - arrowPrev)/10;
    arrowPrev = arrowDest;

    $(".next--arrow img").css("transform", "translate(0px, calc(-50% + "+arrowDest+"px))");
    $(".prev--arrow img").css("transform", "rotate(180Deg) translate(0px, calc(50% + "+-arrowDest+"px)");
  }

  requestAnimationFrame(animMain);
}


//NUMBER PADDING
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


function mapOrder (array, order, key) {

  array.sort( function (a, b) {
    var A = a, B = b;

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }

  });

  return array;
};
