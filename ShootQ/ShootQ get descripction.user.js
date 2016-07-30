// ==UserScript==
// @name         ShootQ get descripction
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.shootq.com/shoots/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var description = [];
    var name;
    
    function isPageReady(){
          return $('#shootrelationships').text() && $('#shootevents').text();
    }
    
    function normalizeStringArray(arr){
        for(var i = 0; i < arr.length; i++){
            var line = arr[i].trim();
            if(line === ''){
                arr.splice(i, 1);
                i--;
            }else{
                arr[i] = line;
            }
        }
        return arr;
    }
    function outputResult(){
        var descriptionString = description.join('\n');
        window.Shoot = {
            name: name.replace('&', '+'),
            descriptioin: descriptionString
        };
    }
    function getDetails(){
        setTimeout(function(){
            var details = $('.orderdetails');
            if(details){
                console.log('details:\n' + details);
                var header = details.find('h1').text();
                var desp = details.find('p').text();
                description.push(header);
                description.push('');
                description.push(desp);
                outputResult();
            }else{
                getDetails();
            }
        }, 1000);
    }

    function getDescription(){
        var contact = $('#shootrelationships td:nth-of-type(2)').children(":visible").text().split('\n');
        var info = $("#shootevents td:nth-of-type(2)").text().split('\n');   
        
        normalizeStringArray(contact);
        normalizeStringArray(info);
        console.log('Contact:\n' + contact);
        console.log('info:\n' + info);
        
        name = info[0];
        description.push(info[1]);
        description.push('');
        for(var i = 0; i < contact.length; i++){
            var line = contact[i];
            if(line !== ''){
                description.push(line);
            }
        }
        description.push('');
        for(i = 2; i < info.length; i++){
            var infoLine = info[i];
            if(infoLine !== ''){
                description.push(infoLine);
            }
        }
        description.push('');
        $('#shootdetails a:eq(0)').click();
        getDetails();
    }

    // Your code here...
    window.addEventListener('load', function(){
        var timer = setInterval(function(){

            if(isPageReady()){
                clearInterval(timer);
                getDescription();
            }
        }, 1000);

    });

})();