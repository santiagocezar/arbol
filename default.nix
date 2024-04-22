let pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  buildInputs = with pkgs; [
  	nodePackages.vscode-html-languageserver-bin
  	nodePackages.vscode-css-languageserver-bin
  	nodePackages.vscode-json-languageserver-bin
  	nodePackages.typescript-language-server
  ];
}
