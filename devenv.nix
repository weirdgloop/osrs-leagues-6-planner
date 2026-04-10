{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.nixfmt
  ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    directory = "./web";
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript = {
    enable = true;
  };

  languages.python = {
    enable = true;
    directory = "./python";
    uv = {
      enable = true;
      sync.enable = true;
    };
    venv.enable = true;
  };

  scripts = {
    convert-images.exec = ''
          	cd "$DEVENV_ROOT"
          	rm -r data/old-preprocessed-data
          	mv data/preprocessed-data data/old-preprocessed-data
            python python/src/process_images.py data/raw-data/Talent_data_wiki data/preprocessed-data
            rm -r web/src/skill_tree/icons/
            mkdir -p web/src/skill_tree/icons/
      		cp -r data/preprocessed-data/tile_png/export/* web/src/skill_tree/icons/
      		cp data/preprocessed-data/node_data/dbrow_definitions.json web/src/skill_tree/
    '';
  };

  git-hooks.hooks = {
    treefmt.enable = true;
  };

  treefmt = {
    enable = true;
    config.programs = {
      shellcheck.enable = true;
      shfmt.enable = true;
      nixfmt.enable = true;
      ruff-check.enable = true;
      ruff-format.enable = true;
    };
  };

  # See full reference at https://devenv.sh/reference/options/

  devcontainer.enable = true;
  difftastic.enable = true;
  delta.enable = true;
}
