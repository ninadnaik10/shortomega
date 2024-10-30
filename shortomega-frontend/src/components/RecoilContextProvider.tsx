import { RecoilRoot, atom } from "recoil";

export default function RecoidContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
