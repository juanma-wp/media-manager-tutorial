import { Button } from "@wordpress/components";
import { close } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { DataForm } from "@wordpress/dataviews/wp";

const SidebarPanel = ({ isOpen, onClose, title, children, selectedItem, fields, form, onChange }) => {
	return (
		<div className={`sidebar-panel ${isOpen ? "is-open" : ""}`}>
			{/* Sidebar Header */}
			<div className="sidebar-panel__header">
				<h2 className="sidebar-panel__title">{title || __("Details")}</h2>
				<Button
					icon={close}
					label={__("Close sidebar")}
					onClick={onClose}
					className="sidebar-panel__close-button"
					size="small"
				/>
			</div>

			{/* Sidebar Content */}
			<div className="sidebar-panel__content">
				{selectedItem && fields && form ? (
					<DataForm
						data={selectedItem}
						fields={fields}
						form={form}
						onChange={onChange}
					/>
				) : (
					children
				)}
			</div>
		</div>
	);
};

export default SidebarPanel;