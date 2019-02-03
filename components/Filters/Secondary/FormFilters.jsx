import React from 'react';
import EasyFilters from 'easify/dist/atoms/EasyFilters/EasyFilters';
import { WithMolecule } from 'react-molecule';
import AutoForm from 'uniforms-antd/AutoForm';

const FormFilters = ({ schema, onSubmit }) => (
  <div className="filters-secondary__container">
    <EasyFilters schema={schema}>
      {({}) => (
        <WithMolecule>
          {molecule => (
            <AutoForm
              onSubmit={data => onSubmit(data, molecule)}
              schema={schema}
              autoComplete="off"
            />
          )}
        </WithMolecule>
      )}
    </EasyFilters>
  </div>
);

export default FormFilters;
