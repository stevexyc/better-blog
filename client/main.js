// var subscribe = Meteor.subscribe("myarticles", function(){
// 	Session.set('ready', true)
// });
articles = new Meteor.Collection("Articles");

Router.map(function () {
  this.route('articleshow', {
    path: '/', // match the root path

    waitOn: function () {  // wait for the subscription to be ready; see below
		return Meteor.subscribe('myarticles');
    },
    //when data is null
	notFoundTemplate: 'notFound', 
    data: function () {
		return articles.findOne();
    },
    action: function () {
    	if (this.ready()) {
			// render the articleshow template
			Session.set('view-state', 'post')
			this.render();
    	};
    },
  });
  this.route('articleshow', {
    path: '/posts', // match the root path

    waitOn: function () {  // wait for the subscription to be ready; see below
		return Meteor.subscribe('articlelist');
    },
    //when data is null
	notFoundTemplate: 'notFound', 
    data: function () {
		return articles.findOne();
    },
    action: function () {
    	if (this.ready()) {
    		Session.set('view-state', 'list')
			// render the articleshow template
			this.render();
    	};
    },
  });
  this.route('articleshow', {
    path: '/posts/:slug', // match the root path

    waitOn: function () {  // wait for the subscription to be ready; see below
		return Meteor.subscribe('articlelist');
    },
    //when data is null
	notFoundTemplate: 'notFound', 
    data: function () {
		return articles.findOne({slug: this.params.slug});
    },
    action: function () {
    	if (this.ready()) {
			// render the articleshow template
			Session.set('view-state', 'post')
			Session.set('current-post', this.params.slug);
			this.render();
    	};
    },
  });
});

Deps.autorun(function () {
  Meteor.subscribe("currentarticle", Session.get("current-post"));
});

Template.articleshow.rendered = function() {
	editor = new MediumEditor('.editable');
	console.log('articleshow rendered');
	editor.deactivate();
}

Template.articleshow.isEditing = function() {
	if (Session.equals('editing',true)) {
		return true;
	} else {
		return false;
	}
}
Template.articleshow.state = function () {
	return Session.get('view-state');
}

Template.articleshow.events({
	'click #edit-button': function () {
		editor.activate();
		$('.editable').focus();
		Session.set('editing', true);
	},
	'click #save-button': function () {
		if (Session.equals('editing',true)) {
			$('editable').attr('spellcheck', false);
			var tmpfix = $('<p></p>');
			$('.editable').append(tmpfix); // wtf? this fixes but also doesnt
			tmpfix.remove();
			if (editor !== undefined) {
				var tmp = editor.serialize();
				var posttext = tmp.posttext.value;
				var posttitle = $('#posttitle').val();
				console.log('title: ' + posttitle);
				editor.deactivate();
				console.log('text: ' + tmp.posttext.value);
				Session.set('editing', false);
				// console.log(this._id)
				Meteor.call('update',this._id, posttitle,posttext);
			} else {
				Session.set('editing', false);
			}
		};
	},
	'click #menu-button': function (argument) {
		Session.set('view-state', 'list');
	},
});

Template.articlelist.article = function() {
	return articles.find();
};

UI.registerHelper('zdate', function () {
	var date = this.date;
	var mth = date.getMonth()+1;
	var day = date.getDate();
	return mth+'/'+day;
})
Template.articlelist.today = function () {
	var date = new Date();
	return
}

Template.articlelist.events({
	'click .list-item': function(e,t) {
		// console.log(this._id);
		// var newdata = articles.findOne({_id:this._id});
		// Router.setData(newdata);
		Session.set('view-state', 'post');
		Router.go('/posts/'+this.slug);
	},
	'click #newpost-button': function (e,t) {
		$('#newpost-item').css('display', 'block');
	}
});



