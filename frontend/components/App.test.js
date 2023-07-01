import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from './frontend/components/AppFunctional'
import AppClass from './frontend/components/AppClass'


// Write your tests here
test("Renders without errors", ()=> {
  render(<AppClass/>);
  render(<AppFunctional/>)

  
});



