diff --git a/chrome/browser/ui/views/side_panel/extensions/extension_side_panel_coordinator.cc b/chrome/browser/ui/views/side_panel/extensions/extension_side_panel_coordinator.cc
index 070dc69875260..ec085bed5a493 100644
--- a/chrome/browser/ui/views/side_panel/extensions/extension_side_panel_coordinator.cc
+++ b/chrome/browser/ui/views/side_panel/extensions/extension_side_panel_coordinator.cc
@@ -5,6 +5,7 @@
 #include "chrome/browser/ui/views/side_panel/extensions/extension_side_panel_coordinator.h"
 
 #include "base/strings/utf_string_conversions.h"
+#include "chrome/browser/browseros/core/browseros_constants.h"
 #include "chrome/browser/extensions/extension_tab_util.h"
 #include "chrome/browser/extensions/extension_view_host_factory.h"
 #include "chrome/browser/ui/actions/chrome_action_id.h"
@@ -252,6 +253,13 @@ void ExtensionSidePanelCoordinator::CreateAndRegisterEntry() {
           weak_factory_.GetWeakPtr()),
       /*default_content_width_callback=*/base::NullCallback());
 
+  // 小财神内部已经提供完整顶栏，因此移除浏览器原生标题栏，避免重复占用空间。
+  if (extension_->id() == browseros::kAgentExtensionId) {
+    entry->set_should_show_header(false);
+    entry->set_should_show_outline(false);
+    entry->set_should_show_ephemerally_in_toolbar(false);
+  }
+
   scoped_entry_observation_.Observe(entry.get());
   registry_->Register(std::move(entry));
 }
