import React from 'react';
import { CustomerOrder } from '../../game/types';
import { Cake } from '../bakery/Cake';
import { CustomerAvatar } from './CustomerAvatar';
import { GameIcon } from './GameIcon';
import {
  BASE_OPTIONS,
  FILLING_OPTIONS,
  FROSTING_OPTIONS,
  DECORATION_OPTIONS,
  TOPPING_OPTIONS
} from '../../data/ingredients';

interface OrderQueueProps {
  orders: CustomerOrder[];
  activeOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  isPracticeMode?: boolean;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({
  orders,
  activeOrderId,
  onSelectOrder,
  isPracticeMode = false
}) => {
  return (
    <div className="order-queue-section">
      <div className="order-queue-header flex-center-gap">
        <GameIcon name="book" size={16} color="#7C4DFF" />
        <span className="queue-title">ORDERS IN QUEUE ({orders.length})</span>
      </div>

      <div className="order-tickets-list">
        {orders.map((order) => {
          const isSelected = order.id === activeOrderId;
          const timePercent = isPracticeMode
            ? 100
            : Math.max(0, Math.min(100, (order.remainingTime / order.maxTime) * 100));

          const isUrgent = !isPracticeMode && timePercent < 25;
          const isWarning = !isPracticeMode && timePercent < 45;

          const baseObj = BASE_OPTIONS.find((b) => b.id === order.targetCake.base);
          const fillingObj = FILLING_OPTIONS.find((f) => f.id === order.targetCake.filling);
          const frostingObj = FROSTING_OPTIONS.find((fr) => fr.id === order.targetCake.frosting);
          const decorObj = DECORATION_OPTIONS.find((d) => d.id === order.targetCake.decoration);
          const toppingObj = TOPPING_OPTIONS.find((t) => t.id === order.targetCake.topping);

          return (
            <div
              key={order.id}
              className={`order-ticket-card ${isSelected ? 'ticket-selected' : ''} ${
                isUrgent ? 'ticket-urgent' : ''
              }`}
              onClick={() => onSelectOrder(order.id)}
              role="button"
              tabIndex={0}
              aria-label={`Order from ${order.customerName}`}
            >
              {/* Ticket Clip & Customer Banner */}
              <div className="ticket-top-bar">
                <div className="ticket-customer-info">
                  <CustomerAvatar customerId={order.customerId} size={36} />
                  <div className="ticket-names">
                    <span className="customer-name-text">{order.customerName}</span>
                    <div className="order-difficulty-stars">
                      {Array.from({ length: Math.min(5, order.difficulty) }).map((_, i) => (
                        <GameIcon key={i} name="star" size={11} color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ticket-bonus-badge">
                  +{order.bonusPoints} pts
                </div>
              </div>

              {/* Order Visual Preview & Ingredient Pills */}
              <div className="ticket-body">
                <div className="ticket-cake-preview">
                  <Cake cake={order.targetCake} size="small" showPlate={true} />
                </div>

                <div className="ticket-recipe-tags">
                  {baseObj && (
                    <div className="recipe-pill pill-base" title="Base">
                      <GameIcon name={baseObj.iconType} size={12} color={baseObj.secondaryColor} />
                      <span className="pill-text">{baseObj.name}</span>
                    </div>
                  )}
                  {fillingObj && (
                    <div className="recipe-pill pill-filling" title="Filling">
                      <GameIcon name={fillingObj.iconType} size={12} color={fillingObj.secondaryColor} />
                      <span className="pill-text">{fillingObj.name}</span>
                    </div>
                  )}
                  {frostingObj && (
                    <div className="recipe-pill pill-frosting" title="Frosting">
                      <GameIcon name={frostingObj.iconType} size={12} color={frostingObj.secondaryColor} />
                      <span className="pill-text">{frostingObj.name}</span>
                    </div>
                  )}
                  {decorObj && (
                    <div className="recipe-pill pill-decor" title="Decoration">
                      <GameIcon name={decorObj.iconType} size={12} color={decorObj.secondaryColor} />
                      <span className="pill-text">{decorObj.name}</span>
                    </div>
                  )}
                  {toppingObj && (
                    <div className="recipe-pill pill-topping" title="Topping">
                      <GameIcon name={toppingObj.iconType} size={12} color={toppingObj.secondaryColor} />
                      <span className="pill-text">{toppingObj.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Timer Progress Bar */}
              {!isPracticeMode && (
                <div className="ticket-timer-bar-wrap">
                  <div
                    className={`ticket-timer-fill ${
                      isUrgent ? 'fill-urgent' : isWarning ? 'fill-warning' : 'fill-normal'
                    }`}
                    style={{ width: `${timePercent}%` }}
                  />
                  <span className="ticket-timer-text flex-center-gap">
                    <GameIcon name="clock" size={10} />
                    {order.remainingTime.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
