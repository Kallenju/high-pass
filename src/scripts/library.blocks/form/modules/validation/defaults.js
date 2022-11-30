/* eslint-disable import/prefer-default-export */

const defaults = {
  defaultsClasses: {
    messagesWrapperClass: ['ps-0', 'pb-4'],
    messageClass: ['fs-6', 'ps-2', 'pt-1'],
    errorClass: ['text-danger', 'fw-bolder'],
    invalidFieldClass: ['border', 'border-warning'],
    validFieldClass: ['border', 'border-success'],
  },

  errorMessages: {
    on: true,
    allMessagesTogether: false,
  },

  invalidViewOfField: {
    on: true,
  },

  validViewOfField: {
    on: false,
  },

  validationOnChange: {
    on: true,
  },

  validationOnBlur: {
    on: false,
  },
};

export { defaults };
