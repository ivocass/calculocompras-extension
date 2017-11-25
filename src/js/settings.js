/*
MIT License

Copyright (c) 2017 Ivo Cass

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import app from './app';
import utils from './utils';

export default function Settings(){

    var self = this;
    var dolarInputCustom;
    
    
    function init(){

        
        var showInfoIcons = utils.getSavedItem('showInfoIcons');
        var showCheckboxes = utils.getSavedItem('showCheckboxes');
        var useFranchise = utils.getSavedItem('useFranchise');
        
        

        dolarInputCustom = $('#dolar-input-custom').get(0);
        
        app.valCompra = app.config.defaultPurchase;
        
        
        loadMainColor();

        // it may be null, true, false
        if(showInfoIcons === null) showInfoIcons = app.data.showInfoIcons; // set to default

        app.data.showInfoIcons = showInfoIcons;

        // $('#sliderToggleInfo').prop('checked', app.data.showInfoIcons);

        // it may be null, true, false
        if(showCheckboxes === null) showCheckboxes = app.data.showCheckboxes; // set to default

        app.data.showCheckboxes = showCheckboxes;

        $('#sliderToggleCheckboxes').prop('checked', app.data.showCheckboxes);
        

        if(useFranchise !== null && (useFranchise === true || useFranchise === false)){
            app.data.useFranchise = useFranchise;
        }

        app.saveSettingRequested.add(onSaveSettingRequested);

    }

    this.open = function(){
        $('#settings').removeClass('d-none');  
        
        app.data.showingSettings = true;
    };

    this.close = function(){
        $('#settings').addClass('d-none');

        app.data.showingSettings = false;
    };

    this.setMainColor = function(color){

        $('#app').css('background-color', color, 'important');
        $('.checkbox-check').css('color', color, 'important');
                
        
        $('#section-purchase').css('background-color', color);
        $('#section-details').css('background-color', 'color');
        $('#section-total').css('color', color);

        $('#section-total .panel-title').css('color', color);

        $('#app-links button').css('color', color); 

        app.data.mainColor = color;

        localStorage.setItem('mainColor', color);
    };


    this.onCurrencyModified = function(event, id){
        
        var val = event.target.value;

        if(isNaN(val)){
            $(event.srcElement).addClass('input-error');
            return;
        }

        val = Number(val);

        if(val <= 0){
            $(event.srcElement).addClass('input-error');
        }
        else{
            $(event.srcElement).removeClass('input-error');

            app.currencyModified.dispatch({id:id, value:val});
            
            app.settingsChanged.dispatch();
        }
    };

    this.toggleCustomCurrency = function(id){
        
        var hasCustomVal = !$('#sliderToggle' + id).prop('checked');

        app.currencySliderToggled.dispatch({id:id, value:hasCustomVal});

        app.settingsChanged.dispatch();
    };


    this.toggleInfoIcons = function(){

        app.data.showInfoIcons = $('#sliderToggleInfo').prop('checked');
         
        
        localStorage.setItem('showInfoIcons', app.data.showInfoIcons);
    };

    this.toggleCheckboxes = function(){

        app.data.showCheckboxes = $('#sliderToggleCheckboxes').prop('checked');         
        
        localStorage.setItem('showCheckboxes', app.data.showCheckboxes);
    };
    


    function loadMainColor(){
        
        var mainColor = utils.getSavedItem('mainColor');

        if(mainColor !== null){
            
            self.setMainColor(mainColor);
        }
        else{
            self.setMainColor(app.config.mainColor);
        }
    }

    function onSaveSettingRequested(setting){
        localStorage.setItem(setting.name, setting.value);
    }

    init();
}