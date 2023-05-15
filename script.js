/*const letters = "ABCDEF0123456789";
let interval = null;

$( document ).ready(function() {
     let iteration = 0
     target = $("#title")
     interval = setInterval(() => {
        target.text(()=>{
            return target.text()
            .split("")
            .map((letter, index) => {
                if (1<index && index > iteration && index < 10){
                    return letters[Math.floor(Math.random() * letters.length)]
                }
                return target.attr("data-value")[index]
                }).join("")})

        if (iteration > target.attr("data-value").length+1) clearInterval(interval)
        iteration += 1/3

     }, 50);
});*/
$("#CV-title" ).hover(
    function() {
        $(this).animate({opacity: 0}, 1);
        $(".CV-options-container").animate({opacity: 1}, 200);
        $(".CV-options-container").css('z-index', '1');
    },
    function() {}
);


$(".CV-options-container" ).hover(
    function() {},
    function() {
        console.log("H:)")
        $(this).animate({opacity:0}, 200);
        $("#CV-title").animate({opacity: 0.7}, 200);
        $("#CV-title").css('z-index', '1');
        $(this).css('z-index', '0');
    }
);

$("#CV-title" ).click(
    function() {
        $(this).animate({opacity: 0}, 1);
        $(".CV-options-container").animate({opacity: 1}, 200);
        $(".CV-options-container").css('z-index', '1');
    }
);

$('body').click(function(evt){
    console.log(evt.target, !$(evt.target).is('#CV-title'))
    if(!$(evt.target).is('#CV-title')) {
        $('#CV-title').animate({opacity: 1}, 1);
        $(".CV-options-container").animate({opacity: 0}, 200);
        $("#CV-title").css('z-index', '1');
        $(".CV-options-container").css('z-index', '-1');
    }
});

/*
document.querySelector("h1") = event => {
  let iteration = 0;

  clearInterval(interval);

  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if (index < 2 || iteration > index || index > 8){
            return event.target.dataset.value[index]
        }

        return letters[Math.floor(Math.random() * letters.length)]
      })
      .join("");

    if(iteration >= event.target.dataset.value.length){
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 50);
}*/