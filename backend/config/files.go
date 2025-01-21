package config

type FilesConfig struct {
	Static StaticFileConfig `mapstructure:"static"`
}

type StaticFileConfig struct {
	Root  string `mapstructure:"root"`
	Index string `mapstructure:"index"`
}
