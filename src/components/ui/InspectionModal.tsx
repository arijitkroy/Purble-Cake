import React from 'react';
import { CustomerOrder, CakeState, ValidationError } from '../../game/types';
import { Cake } from '../bakery/Cake';
import { GameIcon } from './GameIcon';

interface InspectionProps {
  order: CustomerOrder;
  submittedCake: CakeState;
  errors: ValidationError[];
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionProps> = ({
  order,
  submittedCake,
  errors,
  onClose
}) => {
  return (
    <div className="modal-backdrop inspection-backdrop">
      <div className="modal-dialog inspection-dialog">
        <div className="modal-header-banner banner-warning">
          <div className="banner-icon-badge">
            <GameIcon name="alert" size={32} color="#FFFFFF" />
          </div>
          <h2>ORDER MISMATCH</h2>
          <p className="modal-subtitle">The customer noticed a difference in recipe!</p>
        </div>

        <div className="inspection-comparison-row">
          {/* Target Cake */}
          <div className="comparison-col target-col">
            <span className="comparison-label">CUSTOMER WANTED</span>
            <div className="comparison-cake-box">
              <Cake cake={order.targetCake} size="medium" />
            </div>
            <span className="customer-tag">Order for {order.customerName}</span>
          </div>

          <div className="comparison-divider">VS</div>

          {/* Player Cake */}
          <div className="comparison-col player-col">
            <span className="comparison-label">YOU DELIVERED</span>
            <div className="comparison-cake-box">
              <Cake cake={submittedCake} size="medium" />
            </div>
            <span className="player-tag">Delivered Cake</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="inspection-errors-list">
          <h3>Recipe Differences:</h3>
          {errors.length === 0 ? (
            <p className="error-row-item">Order timer ran out before delivery.</p>
          ) : (
            errors.map((err, idx) => (
              <div key={idx} className="error-item-card">
                <span className="error-field-badge">{err.label}:</span>
                <span className="error-detail">
                  Expected <strong>{err.expected || 'None'}</strong>, but found{' '}
                  <span className="actual-wrong">{err.actual || 'None'}</span>
                </span>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer-actions">
          <button className="btn-primary-action btn-continue flex-center-gap" onClick={onClose} autoFocus>
            <span>Got It, Next Cake!</span>
            <GameIcon name="arrow-right" size={18} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
};
