import React, { useState, useCallback } from 'react';
import {Check} from 'lucide-react';

import './StepIndicator.css';

export default function StepIndicator(props: any) {
    const {activeStep, totalSteps} = props;

    return(
    <div className="step-indicator-container">
      {Array.from({length: totalSteps}, (_, i) => i + 1).map((step, index) => (
        <React.Fragment key={step}>
          <div className={`step-circle ${
            step <= activeStep ? 'step-circle-active' :
            'step-circle-inactive'
          }`}>
            {step < activeStep ? <Check size={16} /> : step}
          </div>
          {index < totalSteps - 1 && (
            <div className={`step-connector ${
              step < activeStep ? 'step-connector-completed' : 'step-connector-incomplete'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}