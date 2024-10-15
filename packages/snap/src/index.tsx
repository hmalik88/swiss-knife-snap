import type {
  OnNameLookupHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';
import {
  Box,
  Section,
  Row,
  Address,
  Button,
  Icon,
  Link,
} from '@metamask/snaps-sdk/jsx';

const executeSign = async () => {
  const accounts = (await ethereum.request({
    method: 'eth_requestAccounts',
    params: [],
  })) as any[];
  // eslint-disable-next-line no-restricted-globals
  const message = `0x${Buffer.from('RANDOM', 'utf8').toString('hex')}`;
  return ethereum.request({
    method: 'personal_sign',
    params: [accounts[0], message],
  });
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Section>
                <Row label="From">
                  <Address address="0x1234567890123456789012345678901234567890" />
                </Row>
                <Row
                  label="To"
                  variant="warning"
                  tooltip="This address has been deemed dangerous."
                >
                  <Address address="0x0000000000000000000000000000000000000000" />
                </Row>
              </Section>
            </Box>
          ),
        },
      });
    case 'limitnotif':
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: 'REGULAR MESSAGE',
        },
      });
    case 'overlimitnotif':
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message:
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        },
      });
    case 'jsxnotif':
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message:
            'This is an important notification, you should open this in a detailed view',
          content: (
            <Box>
              <Row
                label="From"
                variant="warning"
                tooltip="This address has been deemed dangerous."
              >
                <Address address="0x1234567890123456789012345678901234567890" />
              </Row>
            </Box>
          ),
          title: 'Important Notification',
          footerLink: { text: 'Go home', href: 'metamask://client/' },
        },
      });
    case 'installSnap':
      return snap.request({
        method: 'wallet_requestSnaps',
        params: {
          'npm:@metamask/bip44-example-snap': {},
        },
      });
    case 'sign':
      return await executeSign();
    case 'exampleUI':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: (
            <Box direction="horizontal" alignment="space-between">
              <Button name="back">
                <Link href="metamask://client/">
                  <Icon name="arrow-left" color="primary" size="md" />
                </Link>
              </Button>
            </Box>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { domain } = request;

  if (domain) {
    const resolvedAddress = '0xc0ffee254729296a45a3885639AC7E10F9d54979';
    return {
      resolvedAddresses: [
        { resolvedAddress, protocol: 'test protocol', domainName: domain },
      ],
    };
  }

  return null;
};
