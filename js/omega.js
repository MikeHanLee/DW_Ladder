(function () {
    var attachedPrefix, charCodeUnderscore, colors, profileColorPalette, profileColors;

    angular.module('omega').constant('builtinProfiles', OmegaPac.Profiles.builtinProfiles);

    profileColors = ['#9ce', '#9d9', '#fa8', '#fe9', '#d497ee', '#47b', '#5b5', '#d63', '#ca0'];

    colors = [].concat(profileColors);

    profileColorPalette = ((function () {
        var _results;
        _results = [];
        while (colors.length) {
            _results.push(colors.splice(0, 3));
        }
        return _results;
    })());

    angular.module('omega').constant('profileColors', profileColors);

    angular.module('omega').constant('profileColorPalette', profileColorPalette);

    attachedPrefix = '__ruleListOf_';

    angular.module('omega').constant('getAttachedName', function (name) {
        return attachedPrefix + name;
    });

    angular.module('omega').constant('getParentName', function (name) {
        if (name.indexOf(attachedPrefix) === 0) {
            return name.substr(attachedPrefix.length);
        } else {
            return void 0;
        }
    });

    charCodeUnderscore = '_'.charCodeAt(0);

    angular.module('omega').constant('charCodeUnderscore', charCodeUnderscore);

    angular.module('omega').constant('isProfileNameHidden', function (name) {
        return name.charCodeAt(0) === charCodeUnderscore;
    });

    angular.module('omega').constant('isProfileNameReserved', function (name) {
        return name.charCodeAt(0) === charCodeUnderscore && name.charCodeAt(1) === charCodeUnderscore;
    });

    angular.module('omega').factory('$exceptionHandler', function ($log) {
        return function (exception, cause) {
            if (exception.message === 'transition aborted') {
                return;
            }
            if (exception.message === 'transition superseded') {
                return;
            }
            if (exception.message === 'transition prevented') {
                return;
            }
            if (exception.message === 'transition failed') {
                return;
            }
            return $log.error(exception, cause);
        };
    });

    angular.module('omega').factory('downloadFile', function () {
        var _ref;
        if ((typeof browser !== "undefined" && browser !== null ? (_ref = browser.downloads) != null ? _ref.download : void 0 : void 0) != null) {
            return function (blob, filename) {
                var url;
                url = URL.createObjectURL(blob);
                if (filename) {
                    return browser.downloads.download({
                        url: url,
                        filename: filename
                    });
                } else {
                    return browser.downloads.download({
                        url: url
                    });
                }
            };
        } else {
            return function (blob, filename) {
                var noAutoBom;
                noAutoBom = true;
                return saveAs(blob, filename, noAutoBom);
            };
        }
    });

}).call(this);

/*(function () {
    angular.module('omega').controller('FixedProfileCtrl', function ($scope, $modal, trFilter) {
        var defaultLabel, defaultPort, onBypassListChange, onProxyChange, proxyProperties, scheme, socks5AuthSupported,
            _fn, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        $scope.urlSchemes = ['', 'http', 'https', 'ftp'];
        $scope.urlSchemeDefault = 'fallbackProxy';
        proxyProperties = {
            '': 'fallbackProxy',
            'http': 'proxyForHttp',
            'https': 'proxyForHttps',
            'ftp': 'proxyForFtp'
        };
        $scope.schemeDisp = {
            '': null,
            'http': 'http://',
            'https': 'https://',
            'ftp': 'ftp://'
        };
        defaultPort = {
            'http': 80,
            'https': 443,
            'socks4': 1080,
            'socks5': 1080
        };
        $scope.showAdvanced = false;
        $scope.optionsForScheme = {};
        _ref = $scope.urlSchemes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            scheme = _ref[_i];
            defaultLabel = scheme ? trFilter('options_protocol_useDefault') : trFilter('options_protocol_direct');
            $scope.optionsForScheme[scheme] = [
                {
                    label: defaultLabel,
                    value: void 0
                }, {
                    label: 'HTTP',
                    value: 'http'
                }, {
                    label: 'HTTPS',
                    value: 'https'
                }, {
                    label: 'SOCKS4',
                    value: 'socks4'
                }, {
                    label: 'SOCKS5',
                    value: 'socks5'
                }
            ];
        }
        $scope.proxyEditors = {};
        socks5AuthSupported = ((typeof browser !== "undefined" && browser !== null ? (_ref1 = browser.proxy) != null ? _ref1.register : void 0 : void 0) != null);
        $scope.authSupported = {
            "http": true,
            "https": true,
            "socks5": socks5AuthSupported
        };
        $scope.isProxyAuthActive = function (scheme) {
            var _ref2;
            return ((_ref2 = $scope.profile.auth) != null ? _ref2[proxyProperties[scheme]] : void 0) != null;
        };
        onProxyChange = function (proxyEditors, oldProxyEditors) {
            var proxy, _base, _j, _len1, _name, _ref2, _ref3, _results;
            if (!proxyEditors) {
                return;
            }
            _ref2 = $scope.urlSchemes;
            _results = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                scheme = _ref2[_j];
                proxy = proxyEditors[scheme];
                if ($scope.profile.auth && !$scope.authSupported[proxy.scheme]) {
                    delete $scope.profile.auth[proxyProperties[scheme]];
                }
                if (!proxy.scheme) {
                    if (!scheme) {
                        proxyEditors[scheme] = {};
                    }
                    delete $scope.profile[proxyProperties[scheme]];
                    continue;
                } else if (!oldProxyEditors[scheme].scheme) {
                    if (proxy.scheme === proxyEditors[''].scheme) {
                        if (proxy.port == null) {
                            proxy.port = proxyEditors[''].port;
                        }
                    }
                    if (proxy.port == null) {
                        proxy.port = defaultPort[proxy.scheme];
                    }
                    if (proxy.host == null) {
                        proxy.host = (_ref3 = proxyEditors[''].host) != null ? _ref3 : 'example.com';
                    }
                }
                _results.push((_base = $scope.profile)[_name = proxyProperties[scheme]] != null ? _base[_name] : _base[_name] = proxy);
            }
            return _results;
        };
        _ref2 = $scope.urlSchemes;
        _fn = function (scheme) {
            return $scope.$watch((function () {
                return $scope.profile[proxyProperties[scheme]];
            }), function (proxy) {
                if (scheme && proxy) {
                    $scope.showAdvanced = true;
                }
                return $scope.proxyEditors[scheme] = proxy != null ? proxy : {};
            });
        };
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            scheme = _ref2[_j];
            _fn(scheme);
        }
        $scope.$watch('proxyEditors', onProxyChange, true);
        onBypassListChange = function (list) {
            var item;
            return $scope.bypassList = ((function () {
                var _k, _len2, _results;
                _results = [];
                for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
                    item = list[_k];
                    _results.push(item.pattern);
                }
                return _results;
            })()).join('\n');
        };
        $scope.$watch('profile.bypassList', onBypassListChange, true);
        return $scope.$watch('bypassList', function (bypassList, oldList) {
            var entry;
            if ((bypassList == null) || bypassList === oldList) {
                return;
            }
            return $scope.profile.bypassList = (function () {
                var _k, _len2, _ref3, _results;
                _ref3 = bypassList.split(/\r?\n/);
                _results = [];
                for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                    entry = _ref3[_k];
                    if (entry) {
                        _results.push({
                            conditionType: "BypassCondition",
                            pattern: entry
                        });
                    }
                }
                return _results;
            })();
        });
    });

}).call(this);*/

/*(function () {
    angular.module('omega').controller('IoCtrl', function ($scope, $rootScope, $window, $http, omegaTarget, downloadFile) {
        omegaTarget.state('web.restoreOnlineUrl').then(function (url) {
            if (url) {
                return $scope.restoreOnlineUrl = url;
            }
        });
        $scope.exportOptions = function () {
            return $rootScope.applyOptionsConfirm().then(function () {
                var blob, content, plainOptions;
                plainOptions = angular.fromJson(angular.toJson($rootScope.options));
                content = JSON.stringify(plainOptions);
                blob = new Blob([content], {
                    type: "text/plain;charset=utf-8"
                });
                return downloadFile(blob, "OmegaOptions.bak");
            });
        };
        $scope.importSuccess = function () {
            return $rootScope.showAlert({
                type: 'success',
                i18n: 'options_importSuccess',
                message: 'Options imported.'
            });
        };
        $scope.restoreLocal = function (content) {
            $scope.restoringLocal = true;
            return $rootScope.resetOptions(content).then((function () {
                return $scope.importSuccess();
            }), function () {
                return $scope.restoreLocalError();
            })["finally"](function () {
                return $scope.restoringLocal = false;
            });
        };
        $scope.restoreLocalError = function () {
            return $rootScope.showAlert({
                type: 'error',
                i18n: 'options_importFormatError',
                message: 'Invalid backup file!'
            });
        };
        $scope.downloadError = function () {
            return $rootScope.showAlert({
                type: 'error',
                i18n: 'options_importDownloadError',
                message: 'Error downloading backup file!'
            });
        };
        $scope.triggerFileInput = function () {
            angular.element('#restore-local-file').click();
        };
        $scope.restoreOnline = function () {
            omegaTarget.state('web.restoreOnlineUrl', $scope.restoreOnlineUrl);
            $scope.restoringOnline = true;
            return $http({
                method: 'GET',
                url: $scope.restoreOnlineUrl,
                cache: false,
                timeout: 10000,
                responseType: "text"
            }).then((function (result) {
                return $rootScope.resetOptions(result.data).then((function () {
                    return $scope.importSuccess();
                }), function () {
                    return $scope.restoreLocalError();
                });
            }), $scope.downloadError)["finally"](function () {
                return $scope.restoringOnline = false;
            });
        };
        $scope.enableOptionsSync = function (args) {
            var enable;
            enable = function () {
                return omegaTarget.setOptionsSync(true, args)["finally"](function () {
                    return $window.location.reload();
                });
            };
            if (args != null ? args.force : void 0) {
                return enable();
            } else {
                return $rootScope.applyOptionsConfirm().then(enable);
            }
        };
        $scope.disableOptionsSync = function () {
            return omegaTarget.setOptionsSync(false).then(function () {
                return $rootScope.applyOptionsConfirm().then(function () {
                    return $window.location.reload();
                });
            });
        };
        return $scope.resetOptionsSync = function () {
            return omegaTarget.resetOptionsSync().then(function () {
                return $rootScope.applyOptionsConfirm().then(function () {
                    return $window.location.reload();
                });
            });
        };
    });

}).call(this);*/

(function () {
    var __hasProp = {}.hasOwnProperty;
    angular.module('omega').controller('MasterCtrl', function ($scope, $rootScope, $window, $q, $modal, $state, profileColors, profileIcons, omegaTarget, $timeout, $location, $filter, getAttachedName, isProfileNameReserved, isProfileNameHidden, dispNameFilter, downloadFile) {
        var checkFormValid, diff, onOptionChange, showFirstRun, showFirstRunOnce, tr, type, _ref, _ref1, _ref2;
        if (((typeof browser !== "undefined" && browser !== null ? (_ref = browser.proxy) != null ? _ref.register : void 0 : void 0) != null) || ((typeof browser !== "undefined" && browser !== null ? (_ref1 = browser.proxy) != null ? _ref1.registerProxyScript : void 0 : void 0) != null)) {
            $scope.isExperimental = true;
            $scope.pacProfilesUnsupported = true;
        }
        tr = $filter('tr');
        $rootScope.options = null;
        omegaTarget.addOptionsChangeCallback(function (newOptions) {
            $rootScope.options = angular.copy(newOptions);
            $rootScope.optionsOld = angular.copy(newOptions);
            omegaTarget.state('syncOptions').then(function (syncOptions) {
                return $scope.syncOptions = syncOptions;
            });
            return $timeout(function () {
                $rootScope.optionsDirty = false;
                return showFirstRun();
            });
        });
        $rootScope.revertOptions = function () {
            return $window.location.reload();
        };
        $rootScope.exportScript = function (name) {
            var getProfileName;
            getProfileName = name ? $q.when(name) : omegaTarget.state('currentProfileName');
            return getProfileName.then(function (profileName) {
                var ast, blob, fileName, missingProfile, pac, profile, profileNotFound, _ref2;
                if (!profileName) {
                    return;
                }
                profile = $rootScope.profileByName(profileName);
                if ((_ref2 = profile.profileType) === 'DirectProfile' || _ref2 === 'SystemProfile') {
                    return;
                }
                missingProfile = null;
                profileNotFound = function (name) {
                    missingProfile = name;
                    return 'dumb';
                };
                ast = OmegaPac.PacGenerator.script($rootScope.options, profileName, {
                    profileNotFound: profileNotFound
                });
                pac = ast.print_to_string({
                    beautify: true,
                    comments: true
                });
                pac = OmegaPac.PacGenerator.ascii(pac);
                blob = new Blob([pac], {
                    type: "text/plain;charset=utf-8"
                });
                fileName = profileName.replace(/\W+/g, '_');
                downloadFile(blob, "OmegaProfile_" + fileName + ".pac");
                if (missingProfile) {
                    return $timeout(function () {
                        return $rootScope.showAlert({
                            type: 'error',
                            message: tr('options_profileNotFound', [missingProfile])
                        });
                    });
                }
            });
        };
        diff = jsondiffpatch.create({
            objectHash: function (obj) {
                return JSON.stringify(obj);
            },
            textDiff: {
                minLength: 1 / 0
            }
        });
        $rootScope.showAlert = function (alert) {
            return $timeout(function () {
                $scope.alert = alert;
                $scope.alertShown = true;
                $scope.alertShownAt = Date.now();
                $timeout($rootScope.hideAlert, 3000);
            });
        };
        $rootScope.hideAlert = function () {
            return $timeout(function () {
                if (Date.now() - $scope.alertShownAt >= 1000) {
                    return $scope.alertShown = false;
                }
            });
        };
        checkFormValid = function () {
            var fields;
            fields = angular.element('.ng-invalid');
            if (fields.length > 0) {
                fields[0].focus();
                $rootScope.showAlert({
                    type: 'error',
                    i18n: 'options_formInvalid'
                });
                return false;
            }
            return true;
        };
        $rootScope.applyOptions = function () {
            var patch, plainOptions;
            if (!checkFormValid()) {
                return;
            }
            if ($rootScope.$broadcast('omegaApplyOptions').defaultPrevented) {
                return;
            }
            plainOptions = angular.fromJson(angular.toJson($rootScope.options));
            patch = diff.diff($rootScope.optionsOld, plainOptions);
            return omegaTarget.optionsPatch(patch).then(function () {
                return $rootScope.showAlert({
                    type: 'success',
                    i18n: 'options_saveSuccess'
                });
            });
        };
        $rootScope.resetOptions = function (options) {
            return omegaTarget.resetOptions(options).then(function () {
                return $rootScope.showAlert({
                    type: 'success',
                    i18n: 'options_resetSuccess'
                });
            })["catch"](function (err) {
                $rootScope.showAlert({
                    type: 'error',
                    message: err
                });
                return $q.reject(err);
            });
        };
        $rootScope.profileByName = function (name) {
            return OmegaPac.Profiles.byName(name, $rootScope.options);
        };
        $rootScope.systemProfile = $rootScope.profileByName('system');
        $rootScope.externalProfile = {
            color: '#49afcd',
            name: tr('popup_externalProfile'),
            profileType: 'FixedProfile',
            fallbackProxy: {
                host: "127.0.0.1",
                port: 42,
                scheme: "http"
            }
        };
        $rootScope.applyOptionsConfirm = function () {
            if (!checkFormValid()) {
                return $q.reject('form_invalid');
            }
            if (!$rootScope.optionsDirty) {
                return $q.when(true);
            }
            return $rootScope.applyOptions();
        };
        $rootScope.enterUpdate=function(e){
            let ev = e||window.event;
            if(ev.keyCode==13){
                $rootScope.updateProfile("启用");
            }
        };
        $rootScope.modify=function() {
            if (document.querySelector("#main").style.display == "block") {
                document.querySelector("#main").style.display = "none";
                document.querySelector("#setting").style.cssText = "background-color:#FFFFFF;color:#49c5b6;";
                document.querySelector("#own-switch").style.cssText = "padding-bottom:0";
            } else {
                document.querySelector("#main").style.display = "block";
                document.querySelector("#setting").style.cssText = "background-color:rgb(248,249,250);color:#000;height:2.2rem";
                document.querySelector("#own-switch").style.cssText = "padding-bottom:0.5rem";
            }
        };
        var defaultPac;
        var defaultName;
        var defaultColor;
        $.getJSON("default_pac.json",function(data){
            defaultPac=data.defaultPac;
            defaultName=data.defaultPac;
            defaultColor=data.defultColor;
        });
        $rootScope.newProfile = function () {
            var scope;
            scope = $rootScope.$new('isolate');
            scope.options = $rootScope.options;
            scope.isProfileNameReserved = isProfileNameReserved;
            scope.isProfileNameHidden = isProfileNameHidden;
            scope.profileByName = $rootScope.profileByName;
            scope.validateProfileName = {
                conflict: '!$value || !profileByName($value)',
                reserved: '!$value || !isProfileNameReserved($value)'
            };
            scope.profileIcons = profileIcons;
            scope.dispNameFilter = dispNameFilter;
            scope.options = $scope.options;
            scope.pacProfilesUnsupported = $scope.pacProfilesUnsupported;
            let profile = {
                name: defaultName,
                profileType: 'PacProfile',
                color: defaultColor,
                pacUrl: defaultPac
            };
            var choice;
            choice = Math.floor(Math.random() * profileColors.length);
            if (profile.color == null) {
                profile.color = profileColors[choice];
            }
            profile = OmegaPac.Profiles.create(profile);
            OmegaPac.Profiles.updateRevision(profile);
            $rootScope.options[OmegaPac.Profiles.nameAsKey(profile)] = profile;
            $rootScope.updateProfile(profile.name);
            $rootScope.applyOptions();
            return ({
                name: profile.name
            });
        };
        $scope.updatingProfile = {};
        $rootScope.updateProfile = function (name) {
            var regex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
            if (regex.test($scope.model)) {
                document.querySelector("#update-message").style.display = "none";
                document.querySelector("#loadingSpinner").style.display = "block";
                if ($rootScope.optionsOld['+启用']) {
                    var oldPacUrl = $rootScope.optionsOld['+启用'].pacUrl;
                }
                return $rootScope.applyOptionsConfirm().then(function () {
                    return omegaTarget.updateProfile(name, 'bypass_cache').then(function (results) {
                        var error, profileName, result, singleErr, success;
                        success = 0;
                        error = 0;
                        for (profileName in results) {
                            if (!__hasProp.call(results, profileName)) continue;
                            result = results[profileName];
                            if (result instanceof Error) {
                                error++;
                            } else {
                                success++;
                            }
                        }
                        if (error === 0) {
                            document.querySelector("#loadingSpinner").style.display = "none";
                            document.querySelector('#update-message').textContent = "更新成功";
                            document.querySelector('#update-message').title = "";
                            document.querySelector('#update-message').style = "color:#0C0;font-size:0.5rem";
                            return $rootScope.showAlert({
                                type: 'success',
                                i18n: 'options_profileDownloadSuccess'
                            });
                        } else {
                            if (error === 1) {
                                singleErr = results[OmegaPac.Profiles.nameAsKey("启用")];
                                if (singleErr) {
                                    return $q.reject(singleErr);
                                }
                            }
                            return $q.reject(results);
                        }
                    })["catch"](function (err) {
                        var message, _ref2, _ref3, _ref4;
                        message = tr('options_profileDownloadError_' + err.name, [(_ref2 = (_ref3 = err.statusCode) != null ? _ref3 : (_ref4 = err.original) != null ? _ref4.statusCode : void 0) != null ? _ref2 : '']);
                        if (message) {
                            document.querySelector("loadingSpinner").style.display = "none";
                            document.querySelector('#update-message').textContent = "更新失败";
                            document.querySelector('#update-message').style = "color:#F00;font-size:1rem;";
                            document.querySelector('#update-message').title = message;
                            $rootScope.options['+启用'].pacUrl = oldPacUrl;
                            return $rootScope.applyOptions();
                        } else {
                            return $rootScope.showAlert({
                                type: 'error',
                                i18n: 'options_profileDownloadError'
                            });
                        }
                    })["finally"](function () {
                        $scope.model = "";
                        $rootScope.profileByName("启用").pacUrl = $scope.model;
                        if (name != null) {
                            return $scope.updatingProfile[name] = false;
                        } else {
                            return $scope.updatingProfile = {};
                        }
                    });
                });
            } else if($scope.model == undefined){
                document.querySelector("update-message").style.display = "none";
            }else {
                $scope.model = "";
                document.querySelector('#update-message').textContent = "更新失败";
                document.querySelector('#update-message').style = "color:#F00;font-size:1rem;";
            }
        };
        onOptionChange = function (options, oldOptions) {
            if (options === oldOptions || (oldOptions == null)) {
                return;
            }
            return $rootScope.optionsDirty = true;
        };
        $rootScope.$watch('options', onOptionChange, true);
        $rootScope.$on('$stateChangeStart', function (event, _, __, fromState) {
            if (!checkFormValid()) {
                return event.preventDefault();
            }
        });
        $rootScope.$on('$stateChangeSuccess', function () {
            return omegaTarget.lastUrl($location.url());
        });
        $window.onbeforeunload = function () {
            if ($rootScope.optionsDirty) {
                return tr('options_optionsNotSaved');
            } else {
                return null;
            }
        };
        document.addEventListener('click', (function () {
            return $rootScope.hideAlert();
        }), false);
        $scope.profileIcons = profileIcons;
        $scope.dispNameFilter = dispNameFilter;
        _ref2 = OmegaPac.Profiles.formatByType;
        for (type in _ref2) {
            if (!__hasProp.call(_ref2, type)) continue;
            $scope.profileIcons[type] = $scope.profileIcons['RuleListProfile'];
        }
        $scope.alertIcons = {
            'success': 'glyphicon-ok',
            'warning': 'glyphicon-warning-sign',
            'error': 'glyphicon-remove',
            'danger': 'glyphicon-danger'
        };
        $scope.alertClassForType = function (type) {
            if (!type) {
                return '';
            }
            if (type === 'error') {
                type = 'danger';
            }
            return 'alert-' + type;
        };
        $scope.downloadIntervals = [15, 60, 180, 360, 720, 1440, -1];
        $scope.downloadIntervalI18n = function (interval) {
            return "options_downloadInterval_" + (interval < 0 ? "never" : interval);
        };
        $scope.openShortcutConfig = omegaTarget.openShortcutConfig.bind(omegaTarget);
        showFirstRunOnce = true;
        showFirstRun = function () {
            if (!showFirstRunOnce) {
                return;
            }
            showFirstRunOnce = false;
            return omegaTarget.state('firstRun').then(function (firstRun) {
                var profileName, scope;
                if (!firstRun) {
                    return;
                } else {
                    $rootScope.newProfile();
                }
                omegaTarget.state('firstRun', '');
                profileName = null;
                OmegaPac.Profiles.each($rootScope.options, function (key, profile) {
                    if (!profileName && profile.profileType === 'FixedProfile') {
                        return profileName = profile.name;
                    }
                });
                if (!profileName) {
                    return;
                }
                scope = $rootScope.$new('isolate');
                scope.upgrade = firstRun === 'upgrade';
            });
        };
        return omegaTarget.refresh();
    });

}).call(this);

/*(function () {
    ///新建情景模式显示
    angular.module('omega').controller('PacProfileCtrl', function ($rootScope, $scope, $modal) {
        var oldLastUpdate, oldPacScript, oldPacUrl, onProfileChange, set;
        $scope.urlRegex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
        $scope.urlWithFile = /^(ftp|http|https|file):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
        $scope.isFileUrl = OmegaPac.Profiles.isFileUrl;
        $scope.pacUrlCtrl = {
            ctrl: null
        };
        set = OmegaPac.Profiles.referencedBySet($scope.profile, $scope.options);
        $scope.referenced = Object.keys(set).length > 0;
        oldPacUrl = null;
        oldLastUpdate = null;
        oldPacScript = null;
        onProfileChange = function (profile, oldProfile) {
            console.log($scope.profile);
            if (!(profile && oldProfile)) {
                return $scope.pacUrlIsFile = $scope.isFileUrl(profile.pacUrl);
            }
            if (profile.pacUrl !== oldProfile.pacUrl) {
                if (profile.lastUpdate) {
                    oldPacUrl = oldProfile.pacUrl;
                    oldLastUpdate = profile.lastUpdate;
                    oldPacScript = oldProfile.pacScript;
                    profile.lastUpdate = null;
                } else if (oldPacUrl && profile.pacUrl === oldPacUrl) {
                    profile.lastUpdate = oldLastUpdate;
                    profile.pacScript = oldPacScript;
                }
            }
            return $scope.pacUrlIsFile = $scope.isFileUrl(profile.pacUrl);
        };
        $scope.$watch('profile', onProfileChange, true);

    });

}).call(this);*/

/*(function () {
    /!*angular.module('omega').controller('QuickSwitchCtrl', function ($scope, $filter) {
        $scope.sortableOptions = {
            tolerance: 'pointer',
            axis: 'y',
            forceHelperSize: true,
            forcePlaceholderSize: true,
            connectWith: '.cycle-profile-container',
            containment: '#quick-switch-settings'
        };
        return $scope.$watchCollection('options', function (options) {
            var profile;
            if (options == null) {
                return;
            }
            return $scope.notCycledProfiles = (function () {
                var _i, _len, _ref, _results;
                _ref = $filter('profiles')(options, 'all');
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    profile = _ref[_i];
                    if (options["-quickSwitchProfiles"].indexOf(profile.name) < 0) {
                        _results.push(profile.name);
                    }
                }
                return _results;
            })();
        });
    });*!/

}).call(this);*/

/*(function () {
    angular.module('omega').controller('RuleListProfileCtrl', function ($scope) {
        return $scope.ruleListFormats = OmegaPac.Profiles.ruleListFormats;
    });

}).call(this);*/

(function () {
    angular.module('omega').directive('inputGroup', function ($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.catchAll = new RegExp('');
                $timeout(function () {
                    return scope.controller = element.find('input').controller('ngModel');
                });
                scope.oldModel = '';
                scope.controller = scope.input;
                return element.on('change', function () {
                    if (element[0].value) {
                        $rootScope.profileByName("启用").pacUrl = element[0].value;
                        return scope.oldModel = '';
                    }
                });
            }
        };
    });

    /*angular.module('omega').directive('omegaUpload', function () {
        return {
            restrict: 'A',
            scope: {
                success: '&omegaUpload',
                error: '&omegaError'
            },
            link: function (scope, element, attrs) {
                var input;
                input = element[0];
                return element.on('change', function () {
                    var reader;
                    if (input.files.length > 0 && input.files[0].name.length > 0) {
                        reader = new FileReader();
                        reader.addEventListener('load', function (e) {
                            return scope.$apply(function () {
                                return scope.success({
                                    '$content': e.target.result
                                });
                            });
                        });
                        reader.addEventListener('error', function (e) {
                            return scope.$apply(function () {
                                return scope.error({
                                    '$error': e.target.error
                                });
                            });
                        });
                        reader.readAsText(input.files[0]);
                        return input.value = '';
                    }
                });
            }
        };
    });*/

    /*angular.module('omega').directive('omegaIp2str', function () {
        return {
            restrict: 'A',
            priority: 2,
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (value) {
                    if (value) {
                        return OmegaPac.Conditions.fromStr('Ip: ' + value);
                    } else {
                        return {
                            conditionType: 'IpCondition',
                            ip: '0.0.0.0',
                            prefixLength: 0
                        };
                    }
                });
                return ngModel.$formatters.push(function (value) {
                    if (value != null ? value.ip : void 0) {
                        return OmegaPac.Conditions.str(value).split(' ', 2)[1];
                    } else {
                        return '';
                    }
                });
            }
        };
    });*/

}).call(this);

(function () {
    /*angular.module('omega').filter('profiles', function (builtinProfiles, profileOrder, isProfileNameHidden, isProfileNameReserved) {
        var builtinProfileList, charCodePlus, profile, _;
        charCodePlus = '+'.charCodeAt(0);
        builtinProfileList = (function () {
            var _results;
            _results = [];
            for (_ in builtinProfiles) {
                profile = builtinProfiles[_];
                _results.push(profile);
            }
            return _results;
        })();
        return function (options, filter) {
            var name, result, value;
            result = [];
            for (name in options) {
                value = options[name];
                if (name.charCodeAt(0) === charCodePlus) {
                    result.push(value);
                }
            }
            if (typeof filter === 'object' || (typeof filter === 'string' && filter.charCodeAt(0) === charCodePlus)) {
                if (typeof filter === 'string') {
                    filter = filter.substr(1);
                }
                result = OmegaPac.Profiles.validResultProfilesFor(filter, options);
            }
            if (filter === 'all') {
                result = result.filter(function (profile) {
                    return !isProfileNameHidden(profile.name);
                });
                result = result.concat(builtinProfileList);
            } else {
                result = result.filter(function (profile) {
                    return !isProfileNameReserved(profile.name);
                });
            }
            if (filter === 'sorted') {
                result.sort(profileOrder);
            }
            return result;
        };
    });*/

    angular.module('omega').filter('tr', function (omegaTarget) {
        return omegaTarget.getMessage;
    });

    angular.module('omega').filter('dispName', function (omegaTarget) {
        return function (name) {
            if (typeof name === 'object') {
                name = name.name;
            }
            return omegaTarget.getMessage('profile_' + name) || name;
        };
    });

}).call(this);

(function () {
    angular.module('omega').directive('ngLoading', function (Session, $compile) {
        var loadingSpinner = '<img src="https://img.icons8.com/color/48/000000/spinner-frame-7.png">';
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var originalContent = element.html();
                element.html(loadingSpinner);
                scope.$watch(attrs.ngLoading, function (val) {
                    if (val) {
                        element.html(originalContent);
                        $compile(element.contents())(scope);
                    } else {
                        element.html(loadingSpinner);
                    }
                });
            }
        };
    });
}).call(this);
