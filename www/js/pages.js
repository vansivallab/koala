//pages.js

//VIEW
function View(globalView, hash, $view) {
	this.globalView = globalView;
	this.hash = hash;
	this.$view = $view;
}

View.prototype.show = function() {
	if(this.globalView.currView) {this.globalView.currView.hide();}
	if(this.$view) {
		this.$view.css('display', 'block');
	}
	this.globalView.currView = this;
};

View.prototype.hide = function() {
	if(this.$view) {
		this.$view.css('display', 'none');
	}
};

//INITIALIZATION
$(function() {
var globalView = {
	$body: $('body'),
	loginView: undefined,
	selectView: undefined,
	canvasView: undefined,
    helpView: undefined,
    inviteView: undefined,
	currView: this.loginView,
	views: []
};

function initViews() {
	globalView.currView = globalView.loginView = new View(globalView, '#login', $('#loginView'));
	globalView.selectView = new View(globalView, '#select', $('#selectView'));
	globalView.canvasView = new View(globalView, '#canvas', $('#canvasView'));
    globalView.helpView = new View(globalView, '#help', $('#helpView'));
    globalView.inviteView = new View(globalView, '#invite', $('#inviteView'));
	globalView.views = [globalView.loginView, globalView.selectView, globalView.canvasView, globalView.helpView, globalView.inviteView];
};
initViews();


//NAVIGATION
window.util.navigateTo = function(hash) {
	if(hash ===  '') {
		return globalView.loginView.show();
	}
	
	for(var v = 0; v < globalView.views.length; v++) {
		var view = globalView.views[v];
		if(view.hash === hash) {
			return view.show();
		}
	}
}

if (window.location.hash === '') {
	window.location.hash = globalView.loginView.hash;
} 
else {
	window.util.navigateTo(window.location.hash);
}

window.onhashchange = function() {
	// actually perform the navigation
	window.util.navigateTo(window.location.hash);
};

});
