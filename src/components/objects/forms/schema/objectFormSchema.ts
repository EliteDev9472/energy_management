
import * as Yup from 'yup';

export interface ObjectFormValues {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  objectType: string;
  buildPhase: string;
  description: string;
  complex: string;
  project: string;
}

export const objectFormSchema = Yup.object({
  name: Yup.string().required('Naam is verplicht'),
  address: Yup.string().required('Adres is verplicht'),
  postalCode: Yup.string().required('Postcode is verplicht'),
  city: Yup.string().required('Stad is verplicht'),
  objectType: Yup.string().required('Type is verplicht'),
  buildPhase: Yup.string().required('Bouwfase is verplicht'),
  description: Yup.string(),
  complex: Yup.string().required('Complex is verplicht'),
  project: Yup.string(),
});
