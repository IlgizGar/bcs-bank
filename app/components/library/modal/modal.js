import $ from 'jquery';
import modal from 'jquery-modal';
import Form from "../form/form";

export default class Modal {
  constructor($openLink) {
    this.$link = $openLink;
    this.windowId = this.$link.attr('href');
    this.init();
  }

  init() {
    $.modal.defaults = {
      closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
      escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
      clickClose: true,       // Allows the user to close the modal by clicking the overlay
      closeText: '',     // Text content for the close <a> tag.
      closeClass: 'modal__close',         // Add additional class(es) to the close <a> tag.
      showClose: true,        // Shows a (X) icon/link in the top-right corner
      modalClass: "modal",    // CSS class added to the element being displayed in the modal.
      blockerClass: "blocker",  // CSS class added to the overlay (blocker).
      // HTML appended to the default spinner during AJAX requests.
      spinnerHtml: '<div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div>',
      showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
      fadeDuration: null,     // Number of milliseconds the fade transition takes (null means no transition)
      fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
    };
    this.$link.on('click', (e) => {
      this.openWindow();
    })
  }

  openWindow() {
    $(this.windowId).modal();
    global.forms.push(new Form($(this.windowId).find('form')));
  }

  closeWindow() {
    $.modal.close();
  }
}
