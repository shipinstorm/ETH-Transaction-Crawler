import React, { useState } from 'react';
import {
  Box,
  Button,
  EthAddress,
  Field,
  Flex,
  Heading,
  Input,
  Text,
  Loader,
  ToastMessage,
  Pill
} from 'rimble-ui';
import CrawthTable from './components/CrawthTable';
import axios from 'axios';
import './App.css';

const App = () => {
  const [wallet, setWallet] = useState('');
  const [queriedWallet, setQueriedWallet] = useState('');
  const [startBlock, setStartBlock] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  let lastTransactionHash = '';
  let nextStartBlock = 0;

  const apiKey = process.env.REACT_APP_API_KEY;

  function getTransactions() {
    setLoading(true);
    setFetchComplete(false);
    setErrorMsg('');
    setQueriedWallet('');
    setTransactions([]);

    _getTransactions(wallet, startBlock);

    async function _getTransactions(wallet, startBlock) {
      try {
        const { data } = await axios.get(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=${startBlock}&endblock=latest&sort=asc&apikey=${apiKey}`
        );

        if (data.status === '1' && data.message === 'OK') {
          const lastTransactionIdx = data.result.length - 1;
          const lastTransaction = data.result[lastTransactionIdx];

          if (lastTransactionHash === lastTransaction.hash) {
            setTransactions(transactions => [...transactions, ...data.result]);
            setLoading(false);
            setFetchComplete(true);
            return;
          }

          nextStartBlock = lastTransaction.blockNumber;
          lastTransactionHash = lastTransaction.hash;

          // Remove potentially duplicate transactions
          for (let i = lastTransactionIdx; i >= 0; i--) {
            if (data.result[i].blockNumber === nextStartBlock) {
              data.result.pop();
            } else {
              break;
            }
          }

          setTransactions(transactions => [...transactions, ...data.result]);
          if (!queriedWallet) setQueriedWallet(wallet);

          _getTransactions(wallet, nextStartBlock);
        } else {
          throw data;
        }
      } catch (e) {
        setLoading(false);
        setErrorMsg(e);
      }
    }
  }

  return (
    <Box p={3} pt={0}>
      <Flex>
        <Box width={1} height={'10vh'} m={1}>
          <Heading as={'h1'}>Crawthereum</Heading>
          <Text>The Ethereum transactions crawler</Text>
        </Box>
      </Flex>
      <Flex pt={4}>
        <Box width={1} height={'10vh'} m={1}>
          <Field label="Wallet Address">
            <Input
              type="text"
              required
              placeholder="e.g. 0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f"
              mr={2}
              disabled={loading}
              onChange={e => setWallet(e.target.value)}
            />
          </Field>
          <Field label="Start Block (default 0)">
            <Input
              type="number"
              required
              placeholder="e.g. 9000000"
              mr={1}
              disabled={loading}
              onChange={e => setStartBlock(e.target.value)}
            />
          </Field>
          <Field label=" ">
            <Button
              required
              mt={1}
              disabled={wallet.length < 1 || loading}
              onClick={() => getTransactions(wallet, startBlock)}
            >
              Get Transactions
            </Button>
          </Field>
        </Box>
      </Flex>

      <Box width={1} height={'75vh'} m={1}>
        {errorMsg ? (
          <ToastMessage.Failure
            my={3}
            message={errorMsg.message}
            secondaryMessage={errorMsg.result}
          />
        ) : null}
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              marginTop: '5px',
              marginBottom: '20px',
              marginRight: '30px'
            }}
          >
            <Loader size="25px" marginRight="10px" />
            <Text marginRight="80px">Fetching data...</Text>
          </div>
        ) : null}
        {fetchComplete ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              marginTop: '5px',
              marginBottom: '20px',
              marginRight: '30px'
            }}
          >
            <Pill color="green" marginRight="10px">
              Done
            </Pill>
            <Text marginRight="80px">Data fetch complete!</Text>
          </div>
        ) : null}
        <CrawthTable data={transactions} />
      </Box>
    </Box>
  );
};

export default App;
