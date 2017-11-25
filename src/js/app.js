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

"use strict"


import app from './app';
import utils from './utils';

import logger from './logger';

import Signal from './signal';

import Calculator from './calculator';
import Settings from './settings';

import Currency from './currency/currency';
import CurrencyManager from './currency/currencyManager';

Vue.config.devtools = false;


var App = function(){

    log('App()');
    
    
    this.config = new Config();
    this.data;
    var hasInitialized = false;    
    var termsMgr;
    var currencyManager;
    var settings;
    var calc;

    
    this.vm = null;
    this.currencyUpdated = new Signal();
    this.currencySelected = new Signal();
    this.currencySliderToggled = new Signal(); // toggled between automatic/manual
    this.currencyModified = new Signal();
    this.settingsChanged = new Signal();
    this.saveSettingRequested = new Signal();

    


    this.init = function(){

        log('App - init()');

        if(hasInitialized) return;
        hasInitialized = true;

        logger.setMaxEntries(this.config.loggerMaxEntries);

        

        this.data = new Vue({
            el: '#app',
            data: {
                alternativeDesignEnabled:true,
                alternateDetailsEnabled:false,
                mainColor:app.config.mainColor,
                currency:new Currency('USD'), // dummy currency until the current one is set
                currencyUSD:new Currency('USD'),
                currencyEUR:new Currency('EUR'),
                currencyGBP:new Currency('GBP'),            
                currencyARS:new Currency('ARS'),
                
                // Vue CSP has no reactivity with objecs's properties, 
                // so stuff like currency.getHasCustomVal() would only work the first time, when the element is rendered.                 
                currencyUSDVal:0,
                currencyEURVal:0,
                currencyGBPVal:0,                
                isCurrencyUSDCustom:false,
                isCurrencyEURCustom:false,
                isCurrencyGBPCustom:false,
                currencyUSDLastUpdateDate:-1,
                currencyEURLastUpdateDate:-1,
                currencyGBPLastUpdateDate:-1,
                currencyUSDLastUpdateDateReadable:'',
                currencyEURLastUpdateDateReadable:'',
                currencyGBPLastUpdateDateReadable:'',

                currencies:[], 
                selectOptionUSD:'USD (Dólar) - $...',
                selectOptionEUR:'EUR (Euro) - $...',
                selectOptionGBP:'GBP (Libra) - $...',
                selectOptionARS:'ARS (Peso)',
                valCompra:app.config.defaultPurchase,
                valCurrencyConversion:0,        
                valCurrencyConversionText:'$0',        
                valAfip:0,
                valCorreo:app.config.gestionCorreo,
                valFranchise:app.config.valFranchise,
                valTotal:0,
                showAfip:true,
                showCorreo:true,
                useFranchise:true,
                showInfoIcons:true,
                showCheckboxes:true,
                infoModalTitle:'',
                valCompraMax:app.config.valCompraMax,
                isCompraOutOfRange:false,
                showingSettings:false,
                version:app.config.version,
                showingOptions:false            
            },
            methods: {
                
                onCurrencySelected:function(e){currencyManager.onCurrencySelected(e)},
                onLabelClicked:function(name){calc.onLabelClicked(name)},
                showInfoModal:function(id){calc.showInfoModal(id)},
                setMainColor:function(color){settings.setMainColor(color)},
                openSettings:function(color){settings.open()},
                closeSettings:function(color){settings.close()},            
                onCurrencyModified:function(event, id){settings.onCurrencyModified(event, id)},
                toggleCustomCurrency:function(id){settings.toggleCustomCurrency(id)},
                toggleInfoIcons:function(){settings.toggleInfoIcons()},
                toggleCheckboxes:function(){settings.toggleCheckboxes()},
                updateCurrency:function(id){currencyManager.updateCurrency(id)},
                showDetailsSection:function(){app.data.alternateDetailsEnabled = true},
                hideDetailsSection:function(){app.data.alternateDetailsEnabled = false},
                onHomeClicked:function(){app.onHomeClicked()},
                onFacebookClicked:function(){app.onFacebookClicked()},
                openAppInNewWindow:function(){app.openAppInNewWindow()},
                toggleOptions:function(){app.data.showingOptions = !app.data.showingOptions}
            }
        });

        if(!this.config.loggerEnabled){
            logger.disable();
        }
        
        currencyManager = new CurrencyManager();
        settings = new Settings();
        calc = new Calculator();
        
        // only use for testing
        // window.data = app.data;

        this.onHomeClicked = function(){
           window.open('http://www.calculocompras.com','_blank');
        };

        this.onFacebookClicked = function(){
            window.open('https://www.facebook.com/CalculoCompras','_blank');
        };

        this.openAppInNewWindow = function(){
           
            if(utils.getIsBrowser('Chrome')){

                chrome.windows.create({type:'popup', url:'index.html', focused:true, width:467, height:264});
            }
            else
            if(utils.getIsBrowser('Firefox')){

                var popupURL = browser.extension.getURL("index.html");
                browser.windows.create({type:'popup', url:popupURL, width:467, height:264});
            }

            window.close();
        };
    };
}

export default new App();

// $(document).ready(app.init);

app.init();