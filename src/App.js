import { useState, useEffect, useMemo } from '@wordpress/element';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';
// Import our shared field definitions
import { mediaFields } from './media-fields';

// Configure apiFetch to use WordPress authentication
apiFetch.use( apiFetch.createNonceMiddleware( window.mediaManagerData?.nonce ) );

const App = () => {
    const [ media, setMedia ] = useState( [] );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ view, setView ] = useState( {
        type: 'table',
        perPage: 20,
        page: 1,
        sort: {
            field: 'date',
            direction: 'desc'
        },
        search: '',
        fields: [ 'thumbnail', 'title', 'alt_text', 'date', 'filesize' ]
    } );

    // Fetch media items on mount
    useEffect( () => {
        const fetchMedia = async () => {
            try {
                setIsLoading( true );
                const items = await apiFetch( {
                    path: '/wp/v2/media?per_page=100&_embed'
                } );
                setMedia( items );
            } catch ( error ) {
                console.error( 'Error fetching media:', error );
            } finally {
                setIsLoading( false );
            }
        };

        fetchMedia();
    }, [] );

    // Use our shared field definitions from media-fields.js
    // Notice how we're using the same fields that DataForm will use
    const fields = useMemo( () => mediaFields, [] );

    // Process data for pagination and filtering
    const { data: processedData, paginationInfo } = useMemo( () => {
        return filterSortAndPaginate( media, view, fields );
    }, [ media, view, fields ] );

    // Define available layouts
    const defaultLayouts = {
        table: {
            layout: {
                primaryField: 'title',
            }
        },
        grid: {
            layout: {
                primaryField: 'title',
                mediaField: 'thumbnail'
            }
        }
    };

    // Define actions (we'll add edit functionality later)
    const actions = [
        {
            id: 'view',
            label: __( 'View' ),
            isPrimary: true,
            icon: edit,
            callback: ( [ item ] ) => {
                window.open( item.link, '_blank' );
            }
        }
    ];

    return (
        <div>
            <h1>{ __( 'Media Manager' ) }</h1>
            <DataViews
                data={ processedData }
                fields={ fields }
                view={ view }
                onChangeView={ setView }
                defaultLayouts={ defaultLayouts }
                actions={ actions }
                isLoading={ isLoading }
                paginationInfo={ paginationInfo }
            />
        </div>
    );
};

export default App;