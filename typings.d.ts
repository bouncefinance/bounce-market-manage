declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent (props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}

type intl = {
  formatMessage (option: { id: string; defaultMessage?: string }): string;
}
declare interface Window {
  intl: intl
}

declare var intl: intl


type typeEthereum = any
declare interface Window {
  ethereum: typeEthereum
}

declare var ethereum: typeEthereum