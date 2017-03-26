/*global jasmine, __karma__, window*/
// Error.stackTraceLimit = Infinity;
Error.stackTraceLimit = 0;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

__karma__.loaded = function () {
};


function isJsFile(path) {
    return path.slice(-3) == '.js';
}

function isSpecFile(path) {
    return path.slice(-8) == '.spec.js';
}
function isSpecFile1(path) {
    var files = [
        // 'question.form.spec.js',
        // 'progress.service.spec.js',
        // 'answer.service.spec.js',
        // 'survey.form.spec.js',
        'survey-info.component.spec.js'
        // 'question.service.spec.js',
        // 'survey.data-validator.spec.js'
        // 'api.service.spec.js'
    ];
    for(var i = 0; i<files.length; i++) {
        var flength = files[i].length;
        if(path.slice(-flength) == files[i]) return true;
    }
    return false;
}

function isAppFile(path) {
    var appPath = '/base/app/';
    return isJsFile(path) && (path.substr(0, appPath.length) == appPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
    .filter(isSpecFile1)
    .filter(isAppFile);

// Load our SystemJS configuration.
System.config({
    baseURL: '/base',
    map: {
        '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js'
    }
});

System.import('systemjs.config.js')
    .then(initTestBed)
    .then(initTesting);

function initTestBed(){
    return Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ])

        .then(function (providers) {
            var coreTesting    = providers[0];
            var browserTesting = providers[1];

            coreTesting.TestBed.initTestEnvironment(
                browserTesting.BrowserDynamicTestingModule,
                browserTesting.platformBrowserDynamicTesting());
        })
}

// Import all spec files and start karma
function initTesting () {
    return Promise.all(
        allSpecFiles.map(function (moduleName) {
            return System.import(moduleName);
        })
    )
        .then(__karma__.start, __karma__.error);
}
