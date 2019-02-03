import React from 'react';
import ToggleBox from './ToggleBox';
import FormFilters from './FormFilters';

const SecondaryFilters = ({ search, toggleFilters, onSubmit, schema }) => {
  return (
    <>
      <div className="filters-secondary">
        <div className="filters-secondary__line">
          <div className="filters-secondary__line__box" onClick={toggleFilters}>
            <ToggleBox search={search} />
          </div>
        </div>
        {search && <FormFilters onSubmit={onSubmit} schema={schema} />}
      </div>
    </>
  );
};

export default SecondaryFilters;
