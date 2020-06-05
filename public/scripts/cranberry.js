//
// cranberry.js
//

var emailValue;
var fadeDuration = 400;
var logoState = 'loading';
var currentView;
var loginActive = false;
var exhausted = false;

$(document).ready(() => {

    // status message for slow browsers
    message.innerHTML = 'loading...';

    // init firestore
    const db = firebase.firestore();
    db.settings({
        
    });


    firebase.auth().onAuthStateChanged(__authStateChanged);

    // resize action
    $(window).resize(__resize);
    __resize();

    // send link action
    $(sendLinkBtn).click(() => {
        __sendAuthLink();
        return false;
    });

    // logout action
    $(logoutBtn).click(() => {
        __logout();
        return false;
    });

    $(loginBtn).click(() => {
        email = confirmEmail.value;

        firebase.auth()
            .signInWithEmailLink(email, window.location.href)
            .then((result) => {
                // clear email storage
                window.localStorage.removeItem('emailForSignIn');
                __sanitizeUrl();
            })
            .catch((error) => {
                // handle error
                __sanitizeUrl();
                alert(error);
            });
        return false;
    });

    $(sendChatBtn).click(() => {
        var msg = $(userChatMessage).val();
        if (msg)
            appendOutgoingChat('defaultLog', 'Me', msg);
        $(userChatMessage).val('');
        return false;
    });

    // display root application view
    $(app).show();

});

function __sanitizeUrl() {
    var oldURL = window.location.href;
    var index = 0;
    var newURL = oldURL;
    index = oldURL.indexOf('?');
    if (index == -1) {
        index = oldURL.indexOf('#');
    }
    if (index != -1) {
        newURL = oldURL.substring(0, index);
    }
    window.location.href = newURL;
}

function __authStateChanged(user) {
    if (user) {
        exhausted = true;
        $(dashView).display();
        $(loginView).dismiss();
        $(app).addClass('active');
        $(brand).addClass('ready');
    }
    else if (firebase.auth().isSignInWithEmailLink(window.location.href) && !exhausted) {
        var email = window.localStorage.getItem('emailForSignIn');
        if (!email)
            $(loginView).display();
        $(app).removeClass('active');
        $(brand).removeClass('loading').addClass('hero');
    }
    else {
        $(authView).display();
        $(app).removeClass('active');
        $(brand).removeClass('loading').addClass('hero');
    }
}

function __resize() {
    $(app).center();
}

function currentUser() {
    return firebase.auth().currentUser;
}

function __sendAuthLink() {
    if (currentUser())
        return;

    emailValue = email.value;
    if (!emailValue) {
        alert('Please provide your email address.');
        return;
    }
    const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
    };
    firebase.auth().sendSignInLinkToEmail(emailValue, actionCodeSettings)
        .then(() => {
            $('.placeholder-email').html(emailValue);
            $(sentView).display();
        })
        ;
}

function __logout() {
    if (!currentUser())
        return;

    firebase.auth().signOut().then(function () {
        // success
        return false;
    }).catch(function (error) {
        // error
        console.log(error);
        return false;
    });
}

function __swapLogoState(newState) {
    $(brand).removeClass(logoState).addClass(newState);
}

jQuery.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
}

jQuery.fn.display = function () {
    // hide others
    $('.view').dismiss();

    // display this
    $(this).show({ duration: fadeDuration, step: __resize, complete: __resize });
    this._showing = true;
    currentView = this;
    var logoState;
    if (logoState = $(this).attr('data-logo-state'))
        __swapLogoState(logoState);

    if (typeof this._display == 'function')
        this._display.call(this, []);
}

jQuery.fn.dismiss = function () {
    // hide view
    $(this).hide({ duration: fadeDuration, step: __resize, complete: __resize });
    this._showing = false;
}

function appendOutgoingChat(roomID, sender, text) {
    var html = '<div class="chat">' +
        '<div class="message sent">' +
        '<div class="meta">' +
        '<div class="display-name">' + sender + '</div>' +
        '<div class="time" data-timestamp="' + Date() + '">now</div>' +
        '</div><p>' + text + '</p>' +
        '</div></div>'
        ;

    $('#' + roomID).append(html);
}

function appendIncomingChat() {
    var html = '<div class="chat">' +
        '<div class="message received">' +
        '<div class="meta">' +
        '<div class="display-name">' + sender + '</div>' +
        '<div class="time" data-timestamp="' + Date() + '">now</div>' +
        '</div><p>' + text + '</p>' +
        '</div></div>'
        ;

    $('#' + roomID).append(html);
}