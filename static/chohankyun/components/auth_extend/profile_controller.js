'use strict';

var chohankyun = angular.module('chohankyun')

chohankyun.controller('profile_controller', function ($scope, $window, $location, auth_service, validate) {
    var profile_controller = this;
    profile_controller.model = {'username': '', 'password': '', 'email': '', 'local_last_login': ''};
    profile_controller.is_disabled = true;


    auth_service.detail().then(function (data) {
        profile_controller.model = data;
    })

    profile_controller.update = function (formData) {
        profile_controller.errors = [];
        profile_controller.messages = [];
        validate.form_validation(formData, profile_controller.errors);

        if (!formData.$invalid) {
            auth_service.update(profile_controller.model)
                .then(function (data) {
                    profile_controller.message = 'Username has been changed.';
                    $('#profile_change_message_modal').modal('show');
                }, function (error) {
                    profile_controller.message = error.detail;
                    $('#profile_message_modal').modal('show');
                });
        }
    }

    $('#profile_change_message_modal').on('hide.bs.modal', function () {
        $window.location.reload();
    });

    profile_controller.delete = function () {
        $("#confirm_message_modal").modal('show');
    }

     profile_controller.confirm = function (formData) {
         profile_controller.confirm_errors = [];
         validate.form_validation(formData, profile_controller.confirm_errors);

         if (!formData.$invalid) {
             auth_service.delete().then(
                 function (data) {
                     $location.path('/');
                     $window.location.reload();
                 },
                 function (error) {
                     profile_controller.message = error.detail;
                     $("#confirm_message_modal").modal('hide');
                     $('#profile_message_modal').modal('show');
                 });
         }
     }

     $("#confirm_message_modal").on("hide.bs.modal", function () {
        profile_controller.model.password = '';
    });
});
