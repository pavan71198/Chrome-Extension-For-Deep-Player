$(document).ready(function(){
    $("#not-logged-in").addClass("d-none");
    $("#youtube").addClass("d-none");
    $("#not-youtube").addClass("d-none");

    var csrftoken = "";
    var sessionid = "";

    chrome.cookies.get({url: 'http://deep-player.eastus.cloudapp.azure.com/', name: 'csrftoken'},
        function (cookie) {
            console.log(cookie);
            csrftoken = cookie.value;
        }
    );

    chrome.cookies.get({url: 'http://deep-player.eastus.cloudapp.azure.com/', name: 'sessionid'},
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
                        var videoname = tabs[0].title;
                        if (tabURL.host == "www.youtube.com"){
                            $('#youtube').removeClass('d-none');
                            var videoid = tabURL.searchParams.get("v");
                            $('#upload-button').on('click',function(){
                                var videoname = $('#video-name').val();
                                $.ajax({
                                    url: "http://deep-player.eastus.cloudapp.azure.com/uploadvideo/",
                                   type: "POST",
                                   data: {
                                       videoName: videoname,
                                       source: 'youtube',
                                       videoid: videoid,
                                       csrfmiddlewaretoken: csrftoken
                                   },
                                   success: function () {
                                       $('#upload-success').removeClass("d-none");
                                       $('#upload-form').addClass("d-none");
                                   },
                                   error: function(){
                                       console.log("Upload error");
                                   }
                                });
                            });
                        }
                        else{
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