import { createStore } from "solid-js/store";
import { Form, GliderInputEvent, RegisterForm, SubmitCallback } from "../types/Form";
import { Accessor } from "solid-js";

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      validate: Validator[];
    }
  }
}

type Validator = (element: HTMLInputElement, ...rest: any[]) => string

  export const maxLengthValidator: Validator = (
    element: HTMLInputElement,
    maxLength = 5,
  ) => {
    if (element.value.length === 0 || element.value.length < maxLength) {
      return '';
    }

    return `${element.name} should be less than ${maxLength} characters!`;
  };

  export const upperCaseLetterValidator: Validator = (element: HTMLInputElement) => {
    const {value} = element

    if(value.length === 0) {return ''}

    return value[0] !== value[0].toUpperCase() ? `${element.name} first letter should be uppercased!`
  }

const useForm = <T extends Form>(initialForm: T) => {

     const [form, setForm] = createStore(initialForm);
     const [errors, setErrors] = createStore<Form>()

     const handleInput = (e: GliderInputEvent) => {
       const { name, value } = e.currentTarget;
       setForm(name as any, value as any);
     };

     const submitForm = (submitCallback: SubmitCallback<T>) => () => {
        submitCallback(form)
     };

     const validate = (element: HTMLInputElement, accessor: Accessor<Validator[]>) => {
       const validators = accessor() || [];

       element.onblur = checkValidity(element, validators);

     };

   

     const checkValidity = (element: HTMLInputElement, validators: Validator[]) => () => {

        for (const validator of validators) {
            const message = validator(element);

            if (!!message) {
              setErrors(element.name, message);
            } else {
              setErrors(element.name, '');
            }
        }
     };
    return {
        handleInput, submitForm, validate
    }

}

export default useForm