$(document).ready(function(){
    $("#not-logged-in").addClass("d-none");
    $("#youtube").addClass("d-none");
    $("#not-youtube").addClass("d-none");

    var csrftoken = "";
    var sessionid = "";

    chrome.cookies.get({url: 'http://deep-player-new-dev.ap-south-1.elasticbeanstalk.com/', name: 'csrftoken'},
        function (cookie) {
            console.log(cookie);
            csrftoken = cookie.value;
        }
    );

    chrome.cookies.get({url: 'http://deep-player-new-dev.ap-south-1.elasticbeanstalk.com/', name: 'sessionid'},
        function (cookie) {
            console.log(cookie);
            if (cookie){
                sessionid = cookie;
                var userid = sessionid.user_id;
                var username = sessionid.username;
                $("#notlogin").removeClass("d-none");
                chrome.tabs.query({active: true, currentWindow: true},
                    function(tabs){
                        var tabURL = new URL(tabs[0].url);
                        if (tabURL.host == "www.youtube.com"){
                            console.log(tabURL);
                            $('#youtube').removeClass('d-none');
                            var videoid = tabURL.searchParams.get("v");
                            console.log(videoid);
                            $('#upload-button').on('click',function(){
                                var videoname = $('#video-name').val();
                                $.ajax({
                                    url: "http://deep-player-new-dev.ap-south-1.elasticbeanstalk.com/uploadvideo/",
                                   type: "POST",
                                   data: {
                                       videoname: videoname,
                                       source: 'youtube',
                                       videoid: videoid,
                                       csrfmiddlewaretoken: csrftoken
                                   },
                                   success: function () {
                                       $('#upload-success').removeClass("d-none");
                                       $('#upload-form').addClass("d-none");
                                       console.log("Upload request successful");
                                   },
                                   error: function(){
                                       console.log("Upload error");
                                   }
                                });
                            });
                        }
                        else{
                            console.log(tabURL);
                            $('#not-youtube').removeClass('d-none');
                            $("#youtube").addClass("d-none");
                        }
                    }
                )
            }
            else{
                $('#not-logged-in').removeClass('d-none');
                $("#youtube").addClass("d-none");
                $("#not-youtube").addClass("d-none");
            }
        }
    );

});