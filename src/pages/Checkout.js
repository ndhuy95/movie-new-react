import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
// material
import { styled } from '@material-ui/styles';
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../redux/store';
import { createBilling } from '../redux/slices/ticket';

// hooks
import useIsMountedRef from '../hooks/useIsMountedRef';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import CheckoutCart from '../components/checkout/CheckoutCart';
import CheckoutPayment from '../components/checkout/CheckoutPayment';
import CheckoutTickets from '../components/checkout/CheckoutTickets';
import CheckoutOrderComplete from '../components/checkout/CheckoutOrderComplete';

// ----------------------------------------------------------------------

const STEPS = ['Giỏ vé', 'Thanh toán', 'Nhận vé'];

const RootStyle = styled(Page)({
	marginTop: '100px',
	height: '100%'
});

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main
    }
  }
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled'
      }}
    >
      {completed ? (
        <Box component={Icon} icon={checkmarkFill} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.ticket);
  const { cart, billing, activeStep } = checkout;
  const isComplete = activeStep === STEPS.length;

//   useEffect(() => {
//     if (isMountedRef.current) {
//       dispatch(getCart(cart));
//     }
//   }, [dispatch, isMountedRef, cart]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  return (
    <RootStyle title="Thanh toán giỏ vé">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Thanh toán"
          links={[
            { name: 'Trang chủ', href: '/' },
            { name: 'Thanh toán', href: '/checkout' },
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {activeStep === 0 && <CheckoutCart />}
            {activeStep === 1 && <CheckoutPayment />}
            {activeStep === 2 && <CheckoutTickets />}
          </>
        ) : (
          <CheckoutOrderComplete open={isComplete} />
        )}
      </Container>
    </RootStyle>
  );
}
