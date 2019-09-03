export default class formDelivery {
  static deliveryAvailability(data) {
    const deliveryBlock = document.querySelector('.form__form-delivery');
    if (data.delivery !== null && deliveryBlock) {
      deliveryBlock.classList.add('form__form-delivery_active');
      const deliveryContainerJson = data.delivery;
      this.deliveryCourier(deliveryBlock, deliveryContainerJson);
      this.deliveryOffice(deliveryBlock, deliveryContainerJson);
    }
  }

  static deliveryCourier(deliveryBlock, deliveryContainerJson) {
    if (deliveryContainerJson.courier === false) {
      deliveryBlock.querySelector('.js-check-delivery_courier')
        .classList
        .add('js-check-delivery_none');
    }
  }

  static deliveryOffice(deliveryBlock, deliveryContainerJson) {
    const officeDelivery = deliveryContainerJson.office;

    if (officeDelivery.length) {
      const addressContainer = deliveryBlock.querySelector('.js-address-delivery')
        .cloneNode(true);
      deliveryBlock.querySelector('.js-address-delivery')
        .remove();
      const officeDeliveryWrapper = deliveryBlock.querySelector('.form_office-delivery-wrapper');
      officeDeliveryWrapper.innerHTML = '';
      let forIdRandom = 0;
      officeDelivery.forEach((address) => {
        if (addressContainer.querySelector('p')) {
          addressContainer.querySelector('p')
            .remove();
        }
        const addAddress = document.createElement('p');
        addAddress.innerHTML = address;

        addressContainer.querySelector('.js-check-delivery_office input')
          .setAttribute('value', address);
        addressContainer.querySelector('.js-check-delivery_office input')
          .setAttribute('id', 'delivery-' + forIdRandom);
        addressContainer.querySelector('.js-check-delivery_office label')
          .setAttribute('for', 'delivery-' + forIdRandom);
        addressContainer.appendChild(addAddress);
        officeDeliveryWrapper.appendChild(addressContainer.cloneNode(true));
        forIdRandom++;
      });
    } else {
      deliveryBlock.querySelector('.form_office-delivery-wrapper')
        .classList
        .add('form_office-delivery-wrapper_none');
    }
  }
}
