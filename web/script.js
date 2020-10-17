$('document').ready(function () {

  var playing = false;
  var deck = new Array();
  var cdeck = new Array();
  var currcard = null;


  async function run() {
    // Inside a function marked 'async' we can use the 'await' keyword.

    let n = await eel.get_words()();
    // console.log("Got this from Python: " + n);
    return n
  }

  async function send_words(cdeck){
    console.log(cdeck);
    let n  = await eel.save_words(cdeck)();
    console.log("Got this from Python: " + n);
   }


  deck1 = eel.get_words()().then(
    function success(response) {
      console.log(response)
      Init(response);
      // Draw();
      // return response;
    });


  function Init(response) {

    decklocal = JSON.parse(response);


    for (var i = 0; i < decklocal.length; i++) {
      //  console.log(decklocal[i]);
      var card = {
        card: 1 + i,
        picture: decklocal[i][1],
        sound: decklocal[i][0],
        num: decklocal[i][2],
        active: decklocal[i][3]
      };

      
      deck.push(card);

      //  console.log(card.picture, card.sound);      
      $('#store').prepend("<img id=" + card.card + " src=" + card.picture + " style='width:300px;height:300px;'/>");
    };

    console.log(deck.length);
    Draw();
  };



  function ClearText() {
    // $(".flip-card-back").children().delay(1000).slideUp(500).fadeOut(800);
    // $(".flip-card-front").children().delay(1000).slideUp(500).fadeOut(800);
    // $("#fc").slideUp(500).fadeOut(800);
    // $(".flip-card-back").slideUp(500).fadeOut(800);

    $("#yes").slideUp(500).fadeOut(800);
    $("#no").slideUp(500).fadeOut(800);
    $("#play").slideDown(500).fadeOut(800);
    $("#msg").text("Good Job !!");
    $("#fc").hide();
    // startConfetti();
    confetti.start();
  };



  function Draw() {

    // $("#question").remove();

    if (deck.length == 0) {
      ClearText();
      send_words(cdeck);
    }

    if (deck !== null) {

      if (currcard !== null) {
        $("#" + currcard.card).appendTo("#store");
      }

      currcard = deck.shift();
      if (currcard !== null) {
        console.log(currcard);
        $("#" + currcard.card).appendTo("#pic_add");
        playAudio(currcard.sound);
      }

      $("#msg").text(deck.length +1 +" Cards left");

      // console.log(cdeck);
    }

  }


  // Init();
  // Draw();


  $('#yes').click(function () {

    if (currcard.num < 11) {
      currcard.num = currcard.num + 1;
    }
    if (currcard.num > 11) {
      currcard.num = 11;
    }
    cdeck.push(currcard);
    Draw();

  });




  $('#no').click(function () {

    // playAudio(currcard.sound);
    if (currcard.num >= 1) {
      currcard.num = currcard.num - 1;
    }

    deck.push(currcard)
    Draw();

  });

  function setthis() {

    $(".flip-card-back").parent().bind('transitionend', { file: currcard.sound }, function (event) {
      playAudio(event.data.file);
    });

  };

  //$(".flip-card-back").parent().bind( 'transitionend', playAudio, true);

  // $('#no').hover(function () { playAudio(currcard.sound); },function(){} );
  $('#play').click(function () { playAudio(currcard.sound); });

  function playAudio(file) {
    const audio = new Audio(file);
    audio.play();
  };

});


///  confetti  https://codepen.io/anthonygreco/pen/PGPVJz
