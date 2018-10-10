$(document).ready(function () {
  
  const $inviteExternalMemberModal = $('.invite-external-member-modal');

  /////////////
  // Add Member
  /////////////
  $('.btn-add-member').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    let $addMemberModal = $('.add-member-modal');
    populateModalForm($addMemberModal, {
        title: 'Mitglieder hinzufügen',
        closeLabel: 'Abbrechen',
        submitLabel: 'Mitglieder hinzufügen'
    });

    let $modalForm = $addMemberModal.find(".modal-form");
    $addMemberModal.appendTo('body').modal('show');
  });

  $('.add-member-modal form').on('submit', function (e) {
    e.stopPropagation();
    e.preventDefault();

    let userIds = $('.add-member-modal form select').val();
    userIds = userIds.map(userId => {
      return { userId };
    });

    $.ajax({
      url: $(this).attr('action'),
      method: 'POST',
      data: {
        userIds
      }
    }).done(function() {
      $.showNotification('Mitglieder erfolgreich zum Team hinzugefügt', "success", true);
      location.reload();
    }).fail(function() {
      $.showNotification('Problem beim Hinzufügen der Mitglieder', "danger", true);
    });

    return false;
  });

  /////////////
  // Add external Member
  /////////////
  $('.btn-invite-external-member').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    let $inviteExternalMemberModal = $('.invite-external-member-modal');
    populateModalForm($inviteExternalMemberModal, {
        title: 'Externes Mitglied einladen',
        closeLabel: 'Abbrechen',
        submitLabel: 'Mitglied einladen'
    });

    let $modalForm = $inviteExternalMemberModal.find(".modal-form");
    $inviteExternalMemberModal.appendTo('body').modal('show');
  });

  $('.invite-external-member-modal form').on('submit', function (e) {
    e.stopPropagation();
    e.preventDefault();
    const email = $(this).find('#email').val();
    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    if (!email || !validateEmail(email)) {
      $.showNotification('Bitte gib eine gültige E-Mail an.', "danger", true);
      return false;
    }
    
    const role = $(this).find('#role').val();
    if (!role) {
      $.showNotification('Bitte wähle eine Rolle aus.', "danger", true);
      return false;
    }
    
    const teamId = $inviteExternalMemberModal.find(".modal-form .form-group").attr('data-teamId');
    if (!teamId) {
      $.showNotification('Bitte lade die Seite neu.', "danger", true);
      return false;
    }
    const origin = window.location.origin;
    console.log({email, role, teamId, origin});
    $.ajax({
        type: "POST",
        url: origin + "/teams/invitelink",
        data: {
            host: origin,
            role: role,
            teamId: teamId,
            invitee: email
        }
    }).done(result => {
      console.log(result);
      $inviteExternalMemberModal.modal('hide');
      if (result.inviteCallDone) $.showNotification('Wenn die E-Mail in unserem System existiert, wurde eine Team-Einladungsmail versendet.', "info", true);
      else $.showNotification('Möglicherweise gab es Probleme bei der Einladung. Bitte eingeladenen Nutzer oder Admins fragen.', "danger", true);
    }).fail(function() {
      $.showNotification('Problem beim Versenden der Einladung', "danger", true);
    });
    return false;
  });

  /////////////
  // Edit invitation
  /////////////
  $('.btn-edit-invitation').click(function (e) {
    e.stopPropagation();
    e.preventDefault();

    const $editInvitationModal = $('.edit-invitation-modal');
    const invitationId = $(this).parent().parent().find('[data-payload]').data('payload');

    populateModalForm($editInvitationModal, {
        title: 'Einladung bearbeiten',
        closeLabel: 'Abbrechen',
        submitLabel: 'Änderungen speichern',
        payload: invitationId
    });

    let $modalForm = $editInvitationModal.find(".modal-form");
    $editInvitationModal.appendTo('body').modal('show');
  });

  /////////////
  // Edit Member
  /////////////
  $('.btn-edit-member').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    let $editMemberModal = $('.edit-member-modal');
    const userId = $(this).parent().parent().find('[data-payload]').data('payload');
    populateModalForm($editMemberModal, {
        title: 'Mitglied bearbeiten',
        closeLabel: 'Abbrechen',
        submitLabel: 'Mitglied bearbeiten',
        payload: userId
    });

    let $modalForm = $editMemberModal.find(".modal-form");
    $editMemberModal.appendTo('body').modal('show');
  });

  $('.edit-member-modal form').on('submit', function (e) {
    e.stopPropagation();
    e.preventDefault();

    if (!$(this).find('#role').val()) {
      $.showNotification('Bitte wähle eine Rolle aus.', "danger", true);
      return false;
    }

    const user = {
      userId: $(this).data('payload').userId,
      role: $(this).find('#role').val()
    };

    $.ajax({
      url: $(this).attr('action'),
      method: 'PATCH',
      data: {
        user
      }
    }).done(function() {
      location.reload();
    }).fail(function() {
      $.showNotification('Problem beim Bearbeiten des Mitglieds', "danger", true);
    });

    return false;
  });
    
  /////////////
  // Delete Member
  /////////////
  $('.btn-delete-member').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    let $deleteMemberModal = $('.delete-member-modal');
    const userIdToRemove = $(this).parent().parent().find('[data-payload]').data('payload');
    populateModalForm($deleteMemberModal, {
        title: 'Mitglied löschen',
        closeLabel: 'Abbrechen',
        submitLabel: 'Mitglied löschen',
        payload: userIdToRemove
    });

    let $modalForm = $deleteMemberModal.find(".modal-form");
    $deleteMemberModal.appendTo('body').modal('show');
  });

  $('.delete-member-modal form').on('submit', function (e) {
    e.stopPropagation();
    e.preventDefault();
    const userIdToRemove = $(this).data('payload').userId;

    $.ajax({
      url: $(this).attr('action'),
      method: 'DELETE',
      data: {
        userIdToRemove
      }
    }).done(function() {
      location.reload();
    }).fail(function() {
      $.showNotification('Problem beim Löschen des Mitglieds', "danger", true);
    });

    return false;
  });
});