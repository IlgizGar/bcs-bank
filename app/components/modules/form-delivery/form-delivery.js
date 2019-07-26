export default class formDelivery {
  static deliveryAvailability(data) {
    const deliveryBlock = document.querySelector('.form__form-delivery');
    deliveryBlock.classList.add('form__form-delivery_active');
    const deliveryContainerJson = data.delivery;

    this.deliveryCourier(deliveryBlock, deliveryContainerJson);
    this.deliveryOffice(deliveryBlock, deliveryContainerJson);
  }

  static deliveryCourier(deliveryBlock, deliveryContainerJson) {
    if (deliveryContainerJson.courier === 'false') {
      deliveryBlock.querySelector('.js-check-delivery_courier').classList.add('js-check-delivery_none');
    }
  }

  static deliveryOffice(deliveryBlock, deliveryContainerJson) {
    const officeDelivery = deliveryContainerJson.office;
    if (officeDelivery.length) {
      const addressContainer = deliveryBlock.querySelector('.form__address-delivery');
      addressContainer.innerHTML = '';
      officeDelivery.forEach((address) => {
        const addAddress = document.createElement('p');
        addAddress.innerHTML = address;
        addressContainer.appendChild(addAddress.cloneNode(true));
      });
    }
    else {
      deliveryBlock.querySelector('.js-check-delivery_office').classList.add('js-check-delivery_none');
    }
  }
}
