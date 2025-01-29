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
  Text,
  Footer,
  Container,
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
            'This is an important notification, you should open this in a detailed view [Foo](metamask://client/)',
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

    case 'getContext':
      const interfaceId = await snap.request({
        method: "snap_createInterface",
        params: {
          ui: ( 
            <Box>
              <Button name="interactive-button">Click me</Button>
            </Box>
          ),
          context: { foo: 'bar' },
        },
      });

      const context = snap.request({
        method: 'snap_getInterfaceContext',
        params: {
          id: interfaceId,
        },
      });

      console.log(context);
      return context;
    case 'exampleUI':
      return snap.request({
        method: 'snap_dialog',
        params: {
          content: (
            <Container>
              <Box direction="vertical">
                <Text>First text that wraps so we can see the alignment</Text>
                <Text>Second text that wraps so we can see the alignment</Text>
                <Text>Third text that wraps so we can see the alignment</Text>
                <Text>First text that wraps so we can see the alignment</Text>
                <Text>Second text that wraps so we can see the alignment</Text>
                <Text>Third text that wraps so we can see the alignment</Text>
                <Text>First text that wraps so we can see the alignment</Text>
                <Text>Second text that wraps so we can see the alignment</Text>
                <Text>Third text that wraps so we can see the alignment</Text>
                <Text>First text that wraps so we can see the alignment</Text>
                <Text>Second text that wraps so we can see the alignment</Text>
                <Text>Third text that wraps so we can see the alignment</Text>
                <Text>First text that wraps so we can see the alignment</Text>
                <Text>Second text that wraps so we can see the alignment</Text>
                <Text>Third text that wraps so we can see the alignment</Text>
                <Text>First text that wraps so we can see the alignment</Text>
                <Text>Second text that wraps so we can see the alignment</Text>
                <Text>Third text that wraps so we can see the alignment</Text>
              </Box>
              <Footer requireScroll>
                <Button name="reject">Reject</Button>
                <Button name="accept">Yes</Button>
              </Footer>
            </Container>
          ),
        },
      });
    case 'testMetaMaskLink':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: (
            <Container>
              <Box direction="vertical">
                <Text>Would you like to visit MetaMask's home screen?</Text>
                <Link href="metamask://client/">Click here to go home</Link>
              </Box>
            </Container>
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
