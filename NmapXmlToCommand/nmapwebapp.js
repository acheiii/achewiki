$(function () {

    var Nmap = Backbone.Model.extend({
        parse: function (data) {
            console.log(typeof data);
            if(typeof data === 'object'){
                return data;
            }else{
                data = data.substr(data.indexOf("<nmaprun"));
                var x2js = new X2JS();
                //console.log(JSON.stringify(x2js.xml_str2json(data)));

                var json = JSON.parse(JSON.stringify(x2js.xml_str2json(data)));
                return json;

            }
        }
    });

    var NmapList = Backbone.Collection.extend({
        model: Nmap,
        localStorage: new Backbone.LocalStorage("nmap-backbone"),
    });
    var Nmaps = new NmapList();
    var NmapListView =  Backbone.View.extend({
        tagName:  "tr",
        template: _.template($('#nmap-list-template').html()),
        events: {
            "click .open-item": "show",
            "click .close-item": "clear",
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function () {
            //console.log(this.model.toJSON());
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        show: function () {
            $("td.selected").toggleClass("selected");
            this.$("td").toggleClass("selected");
            new NmapView({model: this.model});
        },
        clear: function () {
            this.model.destroy();
        }
    });

    var NmapView = Backbone.View.extend({
        el: $("#nmap-item"),
        template: _.template($('#nmap-item-template').html()),
        events: {

        },
        initialize: function () {
            this.render();
            //this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    var AppView  = Backbone.View.extend({
        el: $("#menu-container"),
        template: _.template($('#menu-template').html()),
        events: {
            "click #format": "format",
            "click #clear" : "clear",
        },
        initialize: function() {
            //this.listenTo(Nmaps, 'add', this.render);
            Nmaps.fetch();
            this.render();
        },

        render: function() {
            this.$el.html( this.template());
            //console.log(Nmaps.length);
            if(Nmaps.length){
                this.renderAllNmap();
            }
        },
        renderNmap: function (nmap) {
            //console.log(nmap);
            var view = new NmapListView({model: nmap});
            //console.log(view.render().el);
            $("#nmap-list").append(view.render().el);
        },
        renderAllNmap: function () {
            Nmaps.each(this.renderNmap, this);
        },
        format: function () {
            var nmap = new Nmap($("#nmap-result").val(),{parse: true});
            console.log(nmap);
            Nmaps.add(nmap);
            console.log("added");
            nmap.save();
            console.log("saved");
            this.renderNmap(nmap);
        },
        clear: function () {
            $("#nmap-result").val('');
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "default"
        },
        default: function () {
            new AppView();
            console.log("default");
        }
    });

    var router = new Router;
    Backbone.history.start();
});