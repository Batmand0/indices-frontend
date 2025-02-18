import { Box, Text, rem } from "@mantine/core";
import { Check, X } from "tabler-icons-react";
import { PropTypes } from 'prop-types';

function PasswordStrengthMeter({ meets, label }) {
    return (
      <Text
        c={meets ? 'teal' : 'red'}
        style={{ display: 'flex', alignItems: 'center' }}
        mt={7}
        size="sm"
      >
        {meets ? (
          <Check style={{ width: rem(14), height: rem(14) }} />
        ) : (
          <X style={{ width: rem(14), height: rem(14) }} />
        )}{' '}
        <Box ml={10}>{label}</Box>
      </Text>
    );
}

PasswordStrengthMeter.propTypes = {
    meets: PropTypes.bool,
    label: PropTypes.string,
};

export default PasswordStrengthMeter;