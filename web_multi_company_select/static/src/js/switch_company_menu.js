odoo.define('web_multi_company_select.SwitchCompanyMenu', function(require) {
"use strict";



var SwitchCompanyMenu = require('web.SwitchCompanyMenu');
var core = require('web.core');
var session = require('web.session');

SwitchCompanyMenu.include({

    willStart: function () {
        var self = this;
        this.allowed_company_ids = String(session.user_context.allowed_company_ids)
                                    .split(',')
                                    .map(function (id) {return parseInt(id);});
        this.user_companies = session.user_companies.allowed_companies;
        this.user_companies.push([-1,'ALL']);
        this.user_companies.push([-2,'DESELECT']);
        this.current_company = this.allowed_company_ids[0];
        this.current_company_name = _.find(session.user_companies.allowed_companies, function (company) {
            return company[0] === self.current_company;
        })[1];
        return this._super.apply(this, arguments);
    },
    _onToggleCompanyClick: function (ev) {
        if (ev.type == 'keydown' && ev.which != $.ui.keyCode.ENTER && ev.which != $.ui.keyCode.SPACE) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        var dropdownItem = $(ev.currentTarget).parent();
        var companyID = dropdownItem.data('company-id');
        var allowed_company_ids = this.allowed_company_ids;
        var current_company_id = allowed_company_ids[0];
        if (dropdownItem.find('.fa-square-o').length) {
            allowed_company_ids.push(companyID);
            dropdownItem.find('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square');
            $(ev.currentTarget).attr('aria-checked', 'true');
        } else {
            allowed_company_ids.splice(allowed_company_ids.indexOf(companyID), 1);
            dropdownItem.find('.fa-check-square').addClass('fa-square-o').removeClass('fa-check-square');
            $(ev.currentTarget).attr('aria-checked', 'false');
        }
        if (companyID==-2) {
            allowed_company_ids = [];
            if (dropdownItem.find('.fa-square-o').length) {
                allowed_company_ids = [1];
            }
        }
        if (companyID==-1) {
            allowed_company_ids = []
            for (let i = 0; i < this.user_companies.length; i++) {
                if (this.user_companies[i][0] != -1 && this.user_companies[i][0] != -2){
                    allowed_company_ids.push(this.user_companies[i][0]);
                }
            }
            /*for (let i = 0; i < this.allowed_company_ids.length; i++) {
                if (this.allowed_company_ids[i][0] != -1 && this.allowed_company_ids[i][0] != -2){
                    allowed_company_ids.push(this.allowed_company_ids[i][0]);
                }
            }*/
        }
        session.setCompanies(current_company_id, allowed_company_ids);
    },
    _onSwitchCompanyClick: function (ev) {
        if (ev.type == 'keydown' && ev.which != $.ui.keyCode.ENTER && ev.which != $.ui.keyCode.SPACE) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        var dropdownItem = $(ev.currentTarget).parent();
        var dropdownMenu = dropdownItem.parent();
        var companyID = dropdownItem.data('company-id');
        var allowed_company_ids = this.allowed_company_ids;
        if (dropdownItem.find('.fa-square-o').length) {
            // 1 enabled company: Stay in single company mode
            if (this.allowed_company_ids.length === 1) {
                if (this.isMobile) {
                    dropdownMenu = dropdownMenu.parent();
                }
                dropdownMenu.find('.fa-check-square').removeClass('fa-check-square').addClass('fa-square-o');
                dropdownItem.find('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square');
                allowed_company_ids = [companyID];
            } else { // Multi company mode
                allowed_company_ids.push(companyID);
                dropdownItem.find('.fa-square-o').removeClass('fa-square-o').addClass('fa-check-square');
            }
        }
        $(ev.currentTarget).attr('aria-pressed', 'true');
        if (companyID==-1) {
            allowed_company_ids = []
            for (let i = 0; i < this.user_companies.length; i++) {
                if (this.user_companies[i][0] != -1 && this.user_companies[i][0] != -2){
                    allowed_company_ids.push(this.user_companies[i][0]);
                }
            }
        }
        session.setCompanies(companyID, allowed_company_ids);
    },

});

});
