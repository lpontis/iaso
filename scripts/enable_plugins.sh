if [ "$PLUGIN_POLIO_ENABLED" == 'true' && "$MODULE_FEDERATION_ENABLED" == 'false'  ]; then
    cd plugins/polio/js
    npm install
    SKIP_PREFLIGHT_CHECK=true npm run build
fi;