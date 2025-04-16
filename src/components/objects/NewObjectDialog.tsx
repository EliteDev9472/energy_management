
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { objectFormSchema, ObjectFormValues } from '@/components/objects/forms/schema/objectFormSchema';
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchy';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

export interface NewObjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  complexId: string;
  projectId?: string;
  projectName?: string;
  complexName?: string;
  onObjectAdded?: () => void;
}

export function NewObjectDialog({
  isOpen,
  onClose,
  complexId,
  projectId,
  projectName,
  complexName,
  onObjectAdded
}: NewObjectDialogProps) {
  const navigate = useNavigate();
  const initialValues: ObjectFormValues = {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    objectType: '',
    buildPhase: '',
    description: '',
    complex: complexId,
    project: projectId || '',
  };

  const onSubmit = async (values: ObjectFormValues, { setSubmitting, resetForm }: any) => {
    try {
      // Create the new object
      await hierarchyService.addObject({
        ...values,
        complexId: complexId,
        projectId: projectId,
        complexName: complexName
      });

      toast({
        title: "Object aangemaakt",
        description: "Het object is succesvol aangemaakt.",
      });

      // Reset the form and close the dialog
      resetForm();
      onClose();
      
      // Refresh objects
      if (onObjectAdded) {
        onObjectAdded();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating object:', error);
      toast({
        title: "Fout bij aanmaken",
        description: "Er is een fout opgetreden bij het aanmaken van het object.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nieuw Object Toevoegen</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={objectFormSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="name">Naam</Label>
                <Field as={Input} id="name" name="name" type="text" />
                {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="address">Adres</Label>
                <Field as={Input} id="address" name="address" type="text" />
                {touched.address && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postcode</Label>
                <Field as={Input} id="postalCode" name="postalCode" type="text" />
                {touched.postalCode && errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
              </div>
              <div>
                <Label htmlFor="city">Stad</Label>
                <Field as={Input} id="city" name="city" type="text" />
                {touched.city && errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="objectType">Type</Label>
                <Field as={Select} name="objectType">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="woning">Woning</SelectItem>
                    <SelectItem value="utiliteit">Utiliteit</SelectItem>
                    <SelectItem value="installatie">Installatie</SelectItem>
                    <SelectItem value="techniek">Techniek</SelectItem>
                    <SelectItem value="bouwvoorziening">Bouwvoorziening</SelectItem>
                    <SelectItem value="overig">Overig</SelectItem>
                  </SelectContent>
                </Field>
                {touched.objectType && errors.objectType && <p className="text-red-500 text-sm">{errors.objectType}</p>}
              </div>
              <div>
                <Label htmlFor="buildPhase">Bouwfase</Label>
                <Field as={Select} name="buildPhase">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een fase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ontwerp">Ontwerp</SelectItem>
                    <SelectItem value="voorbereiding">Voorbereiding</SelectItem>
                    <SelectItem value="uitvoering">Uitvoering</SelectItem>
                    <SelectItem value="oplevering">Oplevering</SelectItem>
                    <SelectItem value="onderhoud">Onderhoud</SelectItem>
                  </SelectContent>
                </Field>
                {touched.buildPhase && errors.buildPhase && <p className="text-red-500 text-sm">{errors.buildPhase}</p>}
              </div>
              <div>
                <Label htmlFor="description">Omschrijving</Label>
                <Field as={Input} id="description" name="description" type="text" />
                {touched.description && errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Annuleren
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Aanmaken...' : 'Aanmaken'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
