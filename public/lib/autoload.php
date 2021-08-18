<?php

class MadaraClassLoader
{
    /**
     * @var array
     */
    private $prefixes = array();

    /**
     * @param string $prefix
     * @param string $baseDir
     */
    public function addPrefix($prefix, $baseDir)
    {
        $prefix = trim($prefix, '\\').'\\';
        $baseDir = rtrim($baseDir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
        $this->prefixes[] = array($prefix, $baseDir);
    }

    /**
     * @param string $class
     *
     * @return string|null
     */
    public function findFile($class)
    {
        $class = ltrim($class, '\\');

        foreach ($this->prefixes as list($currentPrefix, $currentBaseDir)) {
            if (0 === strpos($class, $currentPrefix)) {
                $classWithoutPrefix = substr($class, strlen($currentPrefix));
                $file = $currentBaseDir.str_replace('\\', DIRECTORY_SEPARATOR, $classWithoutPrefix).'.php';
                if (file_exists($file)) {
                    return $file;
                }
            }
        }
    }

    /**
     * @param string $class
     *
     * @return bool
     */
    public function loadClass($class)
    {
        $file = $this->findFile($class);
        if (null !== $file) {
            require $file;

            return true;
        }

        return false;
    }

    /**
     * Registers this instance as an autoloader.
     *
     * @param bool $prepend
     */
    public function register($prepend = false)
    {
        spl_autoload_register(array($this, 'loadClass'), true, $prepend);
    }

    /**
     * Removes this instance from the registered autoloaders.
     */
    public function unregister()
    {
        spl_autoload_unregister(array($this, 'loadClass'));
    }
}

/**
 * Autoload Class
 *
 * @since  madara alpha 1.0
 * @package madara
 */


$loader = new MadaraClassLoader();



//Register Prefix
$loader->addPrefix( 'App', get_template_directory() . '/app' );

$loader->addPrefix( 'App\\Models', get_template_directory() . '/app/models' );
$loader->addPrefix( 'App\\Config', get_template_directory() . '/app/config' );
$loader->addPrefix( 'App\\Models\\Entity', get_template_directory() . '/app/models/entity' );

$loader->addPrefix( 'App\\Views', get_template_directory() . '/app/views' );

$loader->addPrefix( 'App\\Plugins', get_template_directory() . '/app/plugins' );
$loader->addPrefix( 'App\\Plugins\\Widgets', get_template_directory() . '/app/plugins/madara-widgets' );
$loader->addPrefix( 'App\\Plugins\\Megamenu', get_template_directory() . '/app/plugins/madara-megamenu' );
$loader->addPrefix( 'App\\Plugins\\Walker_Nav_Menu', get_template_directory() . '/app/plugins/madara-walker-nav-menu' );
$loader->addPrefix( 'App\\Plugins\\TGM_Plugin_Activation', get_template_directory() . '/app/plugins/madara-tgm-plugin-activation' );
$loader->addPrefix( 'App\\Plugins\\madara_Option_Tree', get_template_directory() . '/app/plugins/madara-option-tree' );
$loader->addPrefix( 'App\\Plugins\\madara_Welcome', get_template_directory() . '/app/plugins/madara-welcome' );
$loader->addPrefix( 'App\\Plugins\\madara_LandingPage', get_template_directory() . '/app/plugins/madara-landing-page' );
$loader->addPrefix( 'App\\Plugins\\madara_Starter_Content', get_template_directory() . '/app/plugins/madara-starter-content' );
$loader->addPrefix( 'App\\Plugins\\madara_Author', get_template_directory() . '/app/plugins/madara-author' );
$loader->addPrefix( 'App\\Plugins\\madara_WooCommerce', get_template_directory() . '/app/plugins/madara-woocommerce' );
$loader->addPrefix( 'App\\Plugins\\madara_Events_Calendar', get_template_directory() . '/app/plugins/madara-events_calendar' );
$loader->addPrefix( 'App\\Plugins\\madara_Events_Manager', get_template_directory() . '/app/plugins/madara-events_manager' );
$loader->addPrefix( 'App\\Plugins\\madara_VC', get_template_directory() . '/app/plugins/madara-vc' );

$loader->addPrefix( 'App\\Lib', get_template_directory() . '/app/lib' );

$loader->addPrefix( 'App\\Metadatas', get_template_directory() . '/app/metadatas' );

$loader->addPrefix( 'App\\Helpers', get_template_directory() . '/app/helpers' );

//Register Loader
$loader->register();