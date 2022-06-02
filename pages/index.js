import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useContractRead,
  useFeeData,
  useSignMessage,
  useToken,
} from 'wagmi';
import managerABI from '../utils/abis/managerABI.json';

export default function Home() {
  const { data, isError, isLoading } = useAccount();

  return (
    <>
      <div style={{ margin: '1rem' }}>
        <ConnectButton
          accountStatus="address"
          chainStatus="icon"
          showBalance={false}
        />
      </div>

      <GetBoleroManager />
      <GetNetworkFees />
      <TrySignMessage />
      <GetTokenInfos />
    </>
  );
}

function GetBoleroManager() {
  const { data, isError, isLoading } = useContractRead(
    {
      addressOrName: '0x660a93d0bC16f1848aF4850AC08BBd721EfD9148',
      contractInterface: managerABI,
    },
    'getDeployerAddress'
  );

  if (isLoading)
    return <div style={{ margin: '1rem' }}>Fetching Contract data…</div>;
  if (isError)
    return <div style={{ margin: '1rem' }}>Error fetching Contract data</div>;
  return (
    <div style={{ margin: '1rem' }}>
      Bolero Deployer:
      {!isLoading && <p>{data}</p>}
    </div>
  );
}

function GetNetworkFees() {
  const { data, isError, isLoading } = useFeeData();

  if (isLoading)
    return <div style={{ margin: '1rem' }}>Fetching fee data…</div>;
  if (isError)
    return <div style={{ margin: '1rem' }}>Error fetching fee data</div>;
  return (
    <div style={{ margin: '1rem' }}>
      Polygon Fee data: {JSON.stringify(data?.formatted)}
    </div>
  );
}

function TrySignMessage() {
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'GM Bolero frens',
  });

  return (
    <div style={{ margin: '1rem' }}>
      <button disabled={isLoading} onClick={() => signMessage()}>
        Sign message
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
}

function GetTokenInfos() {
  const { data, isError, isLoading } = useToken({
    address: '0x5B9AEfFdFCA5735E7FF0eBafa86D94161A8acF8E',
  });

  if (isLoading) return <div style={{ margin: '1rem' }}>Fetching token…</div>;
  if (isError)
    return <div style={{ margin: '1rem' }}>Error fetching token</div>;
  return (
    <div style={{ margin: '1rem' }}>
      {data?.symbol}: Decimals: {data?.decimals} Total Supply:{' '}
      {data?.totalSupply.formatted}
    </div>
  );
}
