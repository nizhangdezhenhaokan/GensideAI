#!/usr/bin/env python3

"""BrowserOS 产品及其服务端组件的构建配置。"""

from pathlib import Path

from ...core.products import (
    BROWSEROS_AGENT_EXTENSION_ID,
    BROWSEROS_BUG_REPORTER_EXTENSION_ID,
    ProductDescriptor,
)

from ..server_binaries import ServerBundle, SignSpec


# BrowserOS 主产品配置
BROWSEROS_PRODUCT = ProductDescriptor.define(
    # 产品内部唯一标识
    id="browseros",

    # 对外显示的产品名称
    display_name="GensideAI",

    # 构建产物名称前缀，例如安装包名称
    artifact_prefix="GensideAI",

    # Windows 安装程序 GUID，用于系统识别安装/卸载和升级
    windows_installer_guid="{5d8d08af-2df9-4da2-86c1-eac353a0ca32}",

    # 产品简短描述
    summary="智慧小财神",

    # 产品详细描述
    description="GensideAI是一款注重隐私保护、基于 Chromium 构建的网页浏览器.",

    # BrowserOS 启动时必须包含的内置扩展
    required_extensions=(
        # BrowserOS Agent 智能体扩展
        (BROWSEROS_AGENT_EXTENSION_ID, "GensideAI agent"),

        # BrowserOS Bug Reporter 错误反馈扩展
        (BROWSEROS_BUG_REPORTER_EXTENSION_ID, "GensideAI bug reporter"),
    ),
)


# BrowserOS 服务端程序的打包配置
BROWSEROS_SERVER_BUNDLE = ServerBundle(
    # 服务端组件唯一标识
    id="browseros-server",

    # 服务端组件名称
    name="GensideAI Server",

    # 指定该服务端属于哪些产品
    product_ids=("browseros",),

    # Chromium 编译输出目录
    chromium_output_root="BrowserOSServer",

    # 本地服务端资源目录
    local_resources_root=Path("resources/binaries/browseros_server"),

    # Chromium 源码中的服务端资源目录
    chromium_resources_root=Path(
        "chrome/browser/browseros/server/resources"
    ),

    # macOS 应用包中的资源存放目录
    macos_bundle_resources_root=Path(
        "Contents/Resources/BrowserOSServer/default/resources"
    ),

    # Windows 安装包中的资源存放目录
    windows_bundle_resources_root=Path(
        "BrowserOSServer/default/resources"
    ),

    # macOS 需要打包和签名的可执行文件
    macos_binaries={
        # BrowserOS 服务端程序
        "browseros_server": SignSpec(
            "browseros_server",
            "runtime",
            "browseros-executable-entitlements.plist",
        ),

        # Bun JavaScript 运行时
        "bun": SignSpec(
            "bun",
            "runtime",
            "browseros-executable-entitlements.plist",
        ),

        # ripgrep 搜索工具
        "rg": SignSpec(
            "rg",
            "runtime",
        ),
    },

    # Windows 平台需要打包的服务端可执行文件
    windows_binaries=(
        "browseros_server.exe",
    ),

    # 服务端源码使用 Bun 进行构建
    source_builder="bun",

    # 对应的源码组件名称
    source_component="server",

    # 服务端运行时主程序名称
    runtime_binary_name="browseros_server",
)